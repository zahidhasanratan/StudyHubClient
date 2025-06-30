const faqs = [
  {
    q: "How do I submit an assignment?",
    a: "Click on an assignment and paste your Google Docs link with optional notes.",
  },
  {
    q: "Can I grade my own assignment?",
    a: "No, you can only grade work submitted by others.",
  },
  {
    q: "How will I know my assignment is graded?",
    a: "Check the 'My Attempts' section for scores and feedback.",
  },
];

const FAQ = () => {
  return (
    <section className="py-20 bg-base-100 px-6 md:px-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
      </div>
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="collapse collapse-arrow bg-base-200 rounded-lg"
          >
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium">{faq.q}</div>
            <div className="collapse-content">
              <p>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
