import { BookReview } from "@/components/component/book-report";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function combineBookReports(data: Record<string, Record<string, BookReview>>): BookReview[] {
  const combinedReports: BookReview[] = [];

  for (const user in data) {
    if (data.hasOwnProperty(user)) {
      for (const book in data[user]) {
        if (data[user].hasOwnProperty(book)) {
          combinedReports.push(data[user][book]);
        }
      }
    }
  }

  return combinedReports;
}

export function formatDate(numDate: number) {
  const date = new Date(numDate);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return formattedDate
}

export function getUniqueVals(reviews: BookReview[], key: keyof BookReview) {
  const vals = new Set<string>();
  reviews.forEach((review) => {
    vals.add((review[key] as string).toLowerCase());
  });
  return Array.from(vals);
}

export function compareAuthors(a: string, b: string) {
  const [aFirstName, ...aLastNameParts] = a.split(' ');
  const [bFirstName, ...bLastNameParts] = b.split(' ');

  const aLastName = aLastNameParts.join(' ');
  const bLastName = bLastNameParts.join(' ');

  const lastNameComparison = aLastName.localeCompare(bLastName);
  if (lastNameComparison !== 0) {
    return lastNameComparison;
  }

  return aFirstName.localeCompare(bFirstName);
}