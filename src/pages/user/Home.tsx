import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useCategories } from "@/hooks/useCategories";
import { useRecommendedBooks } from "@/hooks/useBooks";
import { usePopularAuthors } from "@/hooks/useAuthors";
import { ROUTES } from "@/constants";
import HeroBanner from "@/components/user/HeroBanner";
import BookCard from "@/components/common/BookCard";
import AuthorCard from "@/components/user/AuthorCard";
import FictionIcon from "@/assets/icons/FictionIcon.svg";
import NonFictionIcon from "@/assets/icons/NonFiction.svg";
import SelfImprovementIcon from "@/assets/icons/SelfImprovementIcon.svg";
import FinanceIcon from "@/assets/icons/Finance.svg";
import ScienceIcon from "@/assets/icons/ScienceandTechno.svg";
import EducationIcon from "@/assets/icons/Education.svg";
import logo from "@/assets/images/Logo.svg";

const CATEGORY_ORDER = [
  "Fiction",
  "Non-Fiction",
  "Self-Improvement",
  "Finance",
  "Science",
  "Education",
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

const categoryIcons: Record<string, string> = {
  Fiction: FictionIcon,
  "Non-Fiction": NonFictionIcon,
  "Self-Improvement": SelfImprovementIcon,
  Finance: FinanceIcon,
  Science: ScienceIcon,
  Education: EducationIcon,
};

const OPENER_KEY = "booky_opener_shown";

export default function Home() {
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const [page, setPage] = useState(1);
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(undefined);

  // Only show opener if it hasn't been shown this session
  const [showOpening, setShowOpening] = useState(() => {
    return !sessionStorage.getItem(OPENER_KEY);
  });

  const displayCategories = categories
    ?.filter((cat: { id: number; name: string }) =>
      CATEGORY_ORDER.includes(cat.name),
    )
    .sort(
      (a: { name: string }, b: { name: string }) =>
        CATEGORY_ORDER.indexOf(a.name) - CATEGORY_ORDER.indexOf(b.name),
    );

  const { data: recommended, isFetching } = useRecommendedBooks({
    by: "rating",
    categoryId: activeCategoryId,
    page,
    limit: 10,
  });

  const { data: popularAuthors } = usePopularAuthors(4);

  const handleCategoryClick = (id: number) => {
    setActiveCategoryId(activeCategoryId === id ? undefined : id);
    setPage(1);
  };

  const dismissOpener = () => {
    sessionStorage.setItem(OPENER_KEY, "true");
    setShowOpening(false);
  };

  useEffect(() => {
    if (!showOpening) return;
    const timer = setTimeout(dismissOpener, 3000);
    return () => clearTimeout(timer);
  }, [showOpening]);

  return (
    <>
      <AnimatePresence>
        {showOpening && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white gap-6"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
            onClick={dismissOpener}
          >
            <motion.img
              src={logo}
              alt="Booky"
              className="w-20 h-20"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            />
            <motion.p
              className="text-center text-lg font-semibold text-gray-700 px-8 max-w-xs"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Books are windows to other worlds,{" "}
              <span className="text-[#1c65da]">welcome travelers!</span>
            </motion.p>
            <motion.p
              className="text-xs text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Tap to skip
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
          <HeroBanner />
        </motion.div>

        {/* Categories - 3x2 on mobile, 6x1 on PC */}
        <motion.section custom={1} initial="hidden" animate="visible" variants={fadeUp}>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
            {displayCategories?.map((cat: { id: number; name: string }, i: number) => (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full flex flex-col items-center justify-center gap-2 p-4 rounded-2xl shadow-sm border-2 transition-colors bg-[#d2e3ff] ${
                  activeCategoryId === cat.id ? "border-[#1c65da]" : "border-transparent"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <img src={categoryIcons[cat.name]} alt={cat.name} className="w-8 h-8 object-contain" />
                <span className="text-xs font-semibold text-gray-700 text-center">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Book Recommendations */}
        <motion.section custom={2} initial="hidden" animate="visible" variants={fadeUp}>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            {activeCategoryId
              ? displayCategories?.find((c: { id: number }) => c.id === activeCategoryId)?.name
              : "Recommendation"}
          </h2>

          {isFetching ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="rounded-xl bg-gray-100 animate-pulse" style={{ aspectRatio: "2/3" }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {recommended?.map((book: any, i: number) => (
                <motion.div
                  key={book.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <BookCard book={book} onClick={() => navigate(ROUTES.BOOK_DETAIL(book.id))} />
                </motion.div>
              ))}
            </div>
          )}

          {recommended && recommended.length >= 10 && (
            <div className="flex justify-center mt-6">
              <motion.button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-8 py-3 rounded-full font-semibold text-sm border-2 border-[#1c65da] text-[#1c65da] bg-white hover:bg-[#d2e3ff] transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Load More
              </motion.button>
            </div>
          )}
        </motion.section>

        {/* Popular Authors */}
        <motion.section custom={3} initial="hidden" animate="visible" variants={fadeUp}>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Popular Authors</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
            {popularAuthors?.map((author: any, i: number) => (
              <motion.div
                key={author.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 md:flex-shrink"
              >
                <AuthorCard author={author} onClick={() => navigate(ROUTES.BOOKS_BY_AUTHOR(author.id))} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </>
  );
}