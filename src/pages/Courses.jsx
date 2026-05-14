import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from "../services/courseService";

const Courses = () => {
  const navigate = useNavigate();
  const courseRef = useRef(null);

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

  // Fetch Courses
  const findAllCourses = async () => {
    setLoading(true);
    try {
      const response = await courseService.getAll(filters);

      if (response.success) {
        setCourses(response.courses);
        setPagination(response.pagination);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    findAllCourses();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8 py-6">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition"
        >
          ← Back
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Explore Courses
          </h1>
          <p className="text-sm text-gray-500">
            Find something useful and start learning
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />

          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Development">Development</option>
            <option value="Programming">Programming</option>
            <option value="Data Science">Data Science</option>
            <option value="Database">Database</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          />

          <input
            type="number"
            placeholder="Max Price"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-3">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
            >
              <option value="createdAt">Newest</option>
              <option value="price">Price</option>
              <option value="title">Title</option>
            </select>

            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={filters.order}
              onChange={(e) => handleFilterChange("order", e.target.value)}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>

          <button
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
            className="text-sm text-red-500 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center text-gray-500 py-20">
          Loading courses...
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          No courses found
        </div>
      ) : (
        <>
          {/* Course Grid */}
          <div
            ref={courseRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {courses.map((course, index) => (
              <div
                key={course._id || index}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer"
                onClick={() => {
                  if (course.price === 0) {
                    navigate(`/course/${course._id}`);
                  } else {
                    navigate(`/courses/${course._id}/pricing`, { state: { course } });
                  }
                }}
              >
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-36 object-cover rounded-lg mb-3"
                  />
                )}

                <h2 className="text-sm font-semibold text-gray-800 line-clamp-1">
                  {course.title}
                </h2>

                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {course.description?.replace(/<[^>]+>/g, '')}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">
                    {course.instructor?.name || "Unknown"}
                  </span>

                  <span className="text-sm font-semibold text-indigo-600">
                    {course.price === 0 ? "Free" : `₹${course.price}`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                disabled={filters.page === 1}
                onClick={() => handlePageChange(filters.page - 1)}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                ← Prev
              </button>

              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                disabled={filters.page === pagination.totalPages}
                onClick={() => handlePageChange(filters.page + 1)}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
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