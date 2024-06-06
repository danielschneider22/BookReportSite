/**
 * v0 by Vercel.
 * @see https://v0.dev/t/HnWwBwDeIvB
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"


import { ref, set, onValue, push } from 'firebase/database';
import { database } from "@/lib/firebase"
import { combineBookReports, compareAuthors, formatDate, getUniqueVals } from "@/lib/utils"


type FilterType = {
  genre: string[],
  author: string[],
  username: string[]
}

export type BookReview = {
  title: string,
  typedTitle: string,
  author: string,
  genre: string,
  rating: string | number,
  image: string,
  date: number,
  username: string,
  review: string
}


export default function Component() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [filters, setFilters] = useState<FilterType>({
    genre: [],
    author: [],
    username: [],
  })
  const [data, setData] = useState<{[user: string]: {[bookTitle: string]: BookReview}}>({})
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    if(username) {
      setFilters({...filters, username: [username]})
    }
    
    const dataRef = ref(database, '/bookreviews');
    onValue(dataRef, (snapshot: any) => {
      const data = snapshot.val();
      setData(data);
    });
  }, []);

  const books = combineBookReports(data);
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        if (searchTerm.trim() !== "") {
          return (
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.genre.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }
        return true
      })
      .filter((book) => {
        if (filters.genre.length > 0) {
          return filters.genre.includes(book.genre)
        }
        return true
      })
      .filter((book) => {
        if (filters.author.length > 0) {
          return filters.author.includes(book.author)
        }
        return true
      })
      .filter((book) => {
        if (filters.username.length > 0) {
          return filters.username.includes(book.username)
        }
        return true
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "date":
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          case "rating":
            return Number(b.rating) - Number(a.rating)
          case "author":
            return compareAuthors(a.author, b.author)
          case "genre":
            return a.genre.localeCompare(b.genre)
          default:
            return 0
        }
      })
  }, [searchTerm, sortBy, filters, books])
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }
  const handleSort = (value: string) => {
    setSortBy(value)
  }
  const handleFilter = (val: string, key: keyof FilterType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: prevFilters[key].includes(val)
        ? prevFilters[key].filter((item) => item !== val)
        : [...prevFilters[key], val],
    }))
  }
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 bg-gray-950 text-gray-50">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold">{filters.username.length === 1 && <>{filters.username[0]}'s</>} Book Reviews</h1>
          <p className="text-gray-400 pt-2">Discover the best books and share your thoughts.</p>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 text-gray-50"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-gray-800 border-gray-700 text-gray-50">
                <ListOrderedIcon className="h-5 w-5" />
                Sort by: {sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700 text-gray-50">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={handleSort}>
                <DropdownMenuRadioItem value="date">Date Reviewed</DropdownMenuRadioItem>
                {filters.username.length !== 1 && <DropdownMenuRadioItem value="reviewer">Reviewer</DropdownMenuRadioItem>}
                <DropdownMenuRadioItem value="rating">Rating</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="author">Author</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-gray-800 border-gray-700 text-gray-50">
                <FilterIcon className="h-5 w-5" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700 text-gray-50">
              {/* <DropdownMenuLabel>Genres</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {getUniqueGenres(books).map((genre) => {
                const genreCapped = genre.charAt(0).toUpperCase() + genre.slice(1);
                return (
                <DropdownMenuCheckboxItem
                  checked={filters.genre.includes(genre)}
                  onCheckedChange={() => handleFilterGenre(genre)}
                  key={genre}
                >
                  {genreCapped}
                </DropdownMenuCheckboxItem>)
              }
              )}
              
              <DropdownMenuSeparator /> */}
              <DropdownMenuLabel>Reviewer</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {getUniqueVals(books, "username").map((username) => {
                return (
                <DropdownMenuCheckboxItem
                  checked={filters.username.includes(username)}
                  onCheckedChange={() => handleFilter(username, "username")}
                  key={username}
                >
                  {username}
                </DropdownMenuCheckboxItem>)
              }
              )}
              
              {/* <DropdownMenuSeparator /> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredBooks.map((book) => (
          <div key={book.title + book.username} className="flex flex-col items-center md:items-left">
            <img
              src={book.image}
              alt={book.title}
              width={192}
              height={288}
              className="rounded-lg object-cover aspect-[2/3]"
            />
            <div className="mt-4 flex flex-col gap-2">
            
              
              <div className="flex items-center gap-2 justify-center">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(Math.floor(Number(book.rating)))].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5" />
                  ))}
                  {Number(book.rating) % 1 !== 0 && <StarHalfIcon className="h-5 w-5" />}
                </div>
                <span className="text-sm font-medium">{Number(book.rating).toFixed(1)}</span>
              </div>
              {/* <div className="text-sm font-medium text-gray-400">{book.genre}</div> */}
              <h3 className="text-lg font-semibold pt-2">{book.title}</h3>
            <p className="text-gray-400">{book.author}</p>
              
              <p className="mt-4 text-gray-200">{book.review}</p>
              {filters.username.length !== 1 && <div className="text-sm pt-2 text-gray-400">-- {book.username}</div>}
              <div className="text-xs font-medium text-gray-400">{formatDate(book.date)}</div>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      className=""
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}


function ListOrderedIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="10" x2="21" y1="6" y2="6" />
      <line x1="10" x2="21" y1="12" y2="12" />
      <line x1="10" x2="21" y1="18" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  )
}


function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function StarHalfIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
<svg {...props} xmlns="http://www.w3.org/2000/svg" height="24" width="27" viewBox="0 0 576 512"><path fill="#FFD43B" d="M288 0c-12.2 .1-23.3 7-28.6 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3L288 439.8V0zM429.9 512c1.1 .1 2.1 .1 3.2 0h-3.2z"/></svg>  )
}


function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
<svg {...props} xmlns="http://www.w3.org/2000/svg" height="24" width="27" viewBox="0 0 576 512"><path fill="#FFD43B" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>  )
}