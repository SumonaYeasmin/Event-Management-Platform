import React from "react";

// Category type definition
interface Category {
  name: string;
  letter: string;
  count: number;
  badgeBg: string;
  badgeTextColor: string;
}

const categories: Category[] = [
  {
    name: "Technology",
    letter: "T",
    count: 1,
    badgeBg: "bg-indigo-50",
    badgeTextColor: "text-[#4f46e5]",
  },
  {
    name: "Business",
    letter: "B",
    count: 1,
    badgeBg: "bg-teal-50",
    badgeTextColor: "text-teal-600",
  },
  {
    name: "Education",
    letter: "E",
    count: 2,
    badgeBg: "bg-emerald-50",
    badgeTextColor: "text-emerald-600",
  },
  {
    name: "Music",
    letter: "M",
    count: 1,
    badgeBg: "bg-rose-50",
    badgeTextColor: "text-rose-500",
  },
  {
    name: "Sports",
    letter: "S",
    count: 1,
    badgeBg: "bg-orange-50",
    badgeTextColor: "text-orange-500",
  },
  {
    name: "Health",
    letter: "H",
    count: 1,
    badgeBg: "bg-emerald-50/75",
    badgeTextColor: "text-emerald-700",
  },
  {
    name: "Workshop",
    letter: "W",
    count: 1,
    badgeBg: "bg-purple-50",
    badgeTextColor: "text-purple-600",
  },
  {
    name: "Conference",
    letter: "C",
    count: 0,
    badgeBg: "bg-blue-50",
    badgeTextColor: "text-blue-600",
  },
];

export default function EventCategories() {
  return (
    <section className="w-full bg-[#f8fafc]/60 py-12 md:py-16 border-b border-slate-100">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Browse by category
          </h2>
        </div>

        {/* Category Grid Layout - 8 columns on large screens with spacing */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-5 lg:gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white border border-slate-100 hover:border-slate-200/80 rounded-2xl py-8 px-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transform transition-all duration-300 cursor-pointer group "
            >
              {/* Circular Badge */}
              <div
                className={`h-10 w-10 rounded-full ${category.badgeBg} flex items-center justify-center font-bold text-sm mb-2.5 shadow-inner group-hover:scale-105 transition duration-200`}
              >
                <span className={category.badgeTextColor}>{category.letter}</span>
              </div>

              {/* Category Name */}
              <h3 className="text-[13px] md:text-sm font-bold text-slate-800 tracking-tight leading-none mb-1">
                {category.name}
              </h3>

              {/* Event Count */}
              <span className="text-[10px] md:text-xs text-slate-400 font-medium tracking-wide">
                {category.count} {category.count === 1 ? "event" : "events"}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
