import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import humanizeDuration from "humanize-duration";
import { assets } from "../../assets/assets";

const CourseDetails = () => {
  const { id } = useParams(); // get course id from URL
  const {
    allCourses,
    calculateRating,
    calculateNoOfLecture,
    calculateChapterTime,
    calculateCourseDuration,
  } = useContext(AppContext); // get all courses from context
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});

  // Find the course from allCourses using the ID
  const fetchCourseData = () => {
    const findCourse = allCourses.find((course) => course._id === id);
    setCourseData(findCourse);
  };

  useEffect(() => {
    fetchCourseData();
  }, [allCourses, id]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Helper to convert minutes to human-readable format
  const getDuration = (minutes) =>
    humanizeDuration(minutes * 60 * 1000, { units: ["h", "m"] });

  return courseData ? (
    <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70"></div>

      {/* Left Column */}
      <div className="max-w-xl z-10 text-gray-500">
        <h1 className="md:text-course-details-heading-large text-course-details-heading-small font-bold text-gray-800">
          {courseData.courseTitle}
        </h1>
        <p
          className="pt-4 md:text-base text-sm"
          dangerouslySetInnerHTML={{
            __html: courseData.courseDescription.slice(0, 300),
          }}
        ></p>
        {/* review and ratings */}
        <div className="flex items-center space-x-2">
          <p>{calculateRating(courseData)}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(calculateRating(courseData))
                    ? assets.star
                    : assets.star_blank
                }
                alt=""
                className="w-3.5 h-3.5"
              />
            ))}
          </div>

          <p className="text-blue-500">
            {courseData.courseRatings.length}{" "}
            {courseData.courseRatings.length > 1 ? "ratings" : "rating"}
          </p>

          <p>
            {courseData.enrolledStudents.length}{" "}
            {courseData.enrolledStudents.length > 1 ? "students" : "student"}
          </p>
        </div>
        <p className="text-sm">
          Course by <span className="text-blue-600 underline">Sudheer</span>
        </p>

        <div className="pt-8 text-gray-800">
          <h2 className="text-xl font-medium">Course Structure</h2>

          {/* Render each chapter */}
          <div className="pt-5">
            {courseData.courseContent.map((chapter, index) => (
              <div
                key={index}
                className="border border-gray-300 bg-white mb-2 rounded"
              >
                <div className="flex  items-center justify-between px-4 py-3 cursor-pointer select-none" onClick={()=>{toggleSection(index)}}>
                  <div className="flex items-center gap-2">
                    <img src={assets.down_arrow_icon} alt="arrow icon" />
                    <p className="text-xl font-semibold mb-2">
                      {chapter.chapterTitle}
                    </p>
                  </div>
                  <p className="text-sm md:text-default">
                    {chapter.chapterContent.length} lecture -
                    {calculateChapterTime(chapter)}
                  </p>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-max" : "max-h-0" }`}>
                  <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className="flex items-start gap-2 py-1">
                        <img
                          src={assets.play_icon}
                          alt="play icon"
                          className="w-4 h-4 mt-1"
                        />
                        <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                          <p>{lecture.lectureTitle}</p>
                          <div className="flex gap-2">
                            {lecture.isPreviewFree && (
                              <p className="text-green-600">Preview</p>
                            )}
                            <p>{getDuration(lecture.lectureDuration)}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-center mt-20 text-gray-500">Loading course details...</p>
  );
};

export default CourseDetails;
