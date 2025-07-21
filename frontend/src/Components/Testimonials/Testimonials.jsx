import React, { useState } from "react";
import "./Testimonials.css";
import person1 from '../../Assets/person1.jpg' // Blonde woman
import person2 from '../../Assets/person2.png' // Woman with black hat and blue fur
import person3 from '../../Assets/person3.jpg' // Dark-haired woman (assuming this is person3)


const testimonials = [
  {
    id: 1,
    name: "Rithu Perera",
    role: "Customer",
    image: person2, // This image matches the one in the screenshot for Rithu (woman with hat)
    rating: 5,
    review:
      "Ladieslive provided me the exact quality product I wanted. I'm very much satisfied by their quick delivery process. They delivered my dress within a day.",
  },
  {
    id: 2,
    name: "Anjali Sharma",
    role: "Customer",
    image: person1, // This image is the blonde woman seen on the left in the screenshot
    rating: 5,
    review:
      "Exactly what I was looking for. Thank you for making my shopping so seamless, pleasant and most of all successful. The products are great!",
  },
  {
    id: 3,
    name: "Mira Das",
    role: "Customer",
    image: person3, // Assuming this is the third image, not clearly visible in the screenshot
    rating: 5,
    review:
      "Very beautiful fabric and perfect stitching. Loved everything from packaging to the fit. Highly recommended!",
  },
];

const Testimonials = () => {
  const [index, setIndex] = useState(0); // Rithu Perera will be the initial active testimonial

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="testimonial-section">
      <div className="testimonial-container">
        <h2 className="testimonial-title">
          This Is What <span>Our Customers Say</span>
        </h2>
        <p className="testimonial-subtitle">
          We value our customer’s feedback to provide the best service.
        </p>

        <div className="testimonial-carousel">
          {testimonials.map((t, i) => {
            let positionClass = "";
            if (i === index) {
              positionClass = "current";
            } else if (
              i === (index === 0 ? testimonials.length - 1 : index - 1)
            ) {
              positionClass = "prev";
            } else if (
              i === (index === testimonials.length - 1 ? 0 : index + 1)
            ) {
              positionClass = "next";
            } else {
              positionClass = "hidden"; 
            }

            return (
              <div
                className={`testimonial-card ${positionClass}`}
                key={t.id}
              >
                <div className="testimonial-image">
                  <img src={t.image} alt={t.name} />
                </div>
                <div className="testimonial-content">
                  <p className="testimonial-text">"{t.review}"</p>
                  <div className="testimonial-rating">
                    {"★".repeat(t.rating)}
                  </div>
                 <div className="rating-underline"></div>
                  <h4 className="testimonial-name">{t.name}</h4>
                  <span className="testimonial-role">{t.role}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="testimonial-buttons">
          <button onClick={handlePrev}>&lt;</button>
          <button onClick={handleNext}>&gt;</button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;