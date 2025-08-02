import React from "react";
import faithImg from "../assets/clients/faith.jpg";
import brianImg from "../assets/clients/brian.jpg";
import avatar from "../assets/avatar.jpg";

const testimonials = [
  {
    name: "Faith M.",
    feedback:
      "DoubleShasa has transformed our brand. Their quality and attention to detail is unmatched!",
    role: "School Administrator, Nairobi",
    image: faithImg,
  },
  {
    name: "Brian K.",
    feedback:
      "From hoodies to custom stationery, they always deliver. Highly recommend!",
    role: "Creative Director, Kisumu",
    image: brianImg,
  },
  {
    name: "Susan W.",
    feedback:
      "Reliable, professional, and fast turnaround. We love working with DoubleShasa!",
    role: "Marketing Lead, Kakamega",
    image: avatar, // fallback or default profile
  },
];
;

const Testimonials = () => {
  return (
    <section className="bg-[#f8f9fa] py-20 px-4" id="testimonials">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-[#00adef] mb-4">What Clients Say</h2>
        <p className="text-[#6c757d] text-lg mb-12 max-w-2xl mx-auto">
          We let our work do the talking — but our happy clients have a few words to share!
        </p>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col items-center text-center"
            >
              <img
                src={t.image}
                onError={(e) => (e.target.src = avatar)}
                alt={t.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#00adef] mb-6"
              />
              <p className="text-gray-700 italic mb-4 leading-relaxed">
                “{t.feedback}”
              </p>
              <h3 className="text-[#00adef] font-semibold text-lg">{t.name}</h3>
              <span className="text-sm text-gray-500">{t.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
