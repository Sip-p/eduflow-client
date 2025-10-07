import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Courses = () => {
  const courseRef = useRef(null);
  const titleRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    published: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    page: 1,
    limit: 12,
    sort: 'createdAt',
    order: 'desc',
  });

  // Fetch courses with filters
  const findAllCourses = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const response = await axios.get(`${backendUrl}/api/course?${queryParams}`);
      if (response.data.success) {
        setCourses(response.data.courses);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (error) {
      console.log('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses when filters change
  useEffect(() => {
    findAllCourses();
  }, [filters]);

  // GSAP animation for course cards
  useEffect(() => {
    if (courses.length > 0 && courseRef.current) {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      const cards = Array.from(courseRef.current.children);

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 15%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
  }, [courses]);

  // GSAP animation for title
  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'elastic.out(1, 0.5)', delay: 0.2 }
      );
    }
  }, []);

  // Filter handler
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  // Pagination handler
  const handlePageChange = (newPage) => {
    if (newPage !== filters.page) {
      setFilters(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 p-6">
      <h1
        ref={titleRef}
        className="text-5xl font-bold mb-6 text-white bg-transparent rounded-lg p-4 border-2 border-white/30 shadow-lg"
      >
        All Available Courses {pagination && `(${pagination.total || courses.length} total)`}
      </h1>

      {/* Filters */}
      <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 mb-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Filters</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search courses..."
            className="border-2 border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />

          <select
            className="border-2 border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Development">Development</option>
            <option value="Programming">Programming</option>
            <option value="Data Science">Data Science</option>
            <option value="Database">Database</option>
            <option value="Security">Security</option>
            <option value="Marketing">Marketing</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            className="border-2 border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />

          <input
            type="number"
            placeholder="Max Price"
            className="border-2 border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <select
            className="border-2 border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.published}
            onChange={(e) => handleFilterChange('published', e.target.value)}
          >
            <option value="">All Courses</option>
            <option value="true">Published Only</option>
            <option value="false">Unpublished Only</option>
          </select>

          <select
            className="border-2 border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            <option value="createdAt">Sort by Date</option>
            <option value="price">Sort by Price</option>
            <option value="title">Sort by Title</option>
            <option value="studentsCount">Sort by Popularity</option>
          </select>

          <select
            className="border-2 border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.order}
            onChange={(e) => handleFilterChange('order', e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>

          <button
            className="bg-red-500 text-white rounded-lg p-2 hover:bg-red-600 transition-colors font-semibold"
            onClick={() =>
              setFilters({
                category: '',
                published: '',
                minPrice: '',
                maxPrice: '',
                search: '',
                page: 1,
                limit: 12,
                sort: 'createdAt',
                order: 'desc',
              })
            }
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Loading / No courses */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-xl">Loading courses... 🎓</div>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-xl">No courses found 😔</div>
        </div>
      ) : (
        <>
          {/* Courses Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4"
            ref={courseRef}
          >
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white border border-yellow-400 border-dashed rounded-xl p-4 shadow-md hover:scale-105 hover:shadow-2xl transition-transform cursor-pointer"
                onClick={() => {
                  if (course.price === 0) {
                    window.location.href = `/course/${course._id}`;
                  } else {
                    navigate('/pricing', { state: { course } });
                  }
                }}
              >
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}

                <h2 className="text-lg font-bold text-gray-800 mb-2">{course.title}</h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {course.description.replace(/<[^>]+>/g, '')}
                </p>

                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                  {course.category}
                </span>

                <div className="flex items-center gap-2 mb-3">
                  {course.instructor?.pic ? (
                    <img
                      src={course.instructor.pic}
                      alt={course.instructor.name}
                      className="h-10 w-10 object-cover rounded-full border-2 border-blue-300"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
                      {course.instructor?.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <p className="text-gray-700 text-sm font-medium">
                    {course.instructor?.name || 'Unknown Instructor'}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-green-600 font-bold text-lg">
                    {course.price === 0 ? 'FREE' : `$${course.price}`}
                  </p>
                  <p className="text-gray-500 text-sm">👥 {course.studentsCount || 0} students</p>
                </div>

                {course.lessonCount && (
                  <p className="text-gray-500 text-xs mt-2">📚 {course.lessonCount} lessons</p>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 mb-8">
              <button
                disabled={filters.page === 1}
                onClick={() => handlePageChange(filters.page - 1)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors shadow-lg"
              >
                ← Previous
              </button>

              <div className="bg-white px-6 py-3 rounded-lg shadow-lg">
                <span className="text-gray-800 font-bold">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
              </div>

              <button
                disabled={filters.page === pagination.totalPages}
                onClick={() => handlePageChange(filters.page + 1)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors shadow-lg"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Courses;
