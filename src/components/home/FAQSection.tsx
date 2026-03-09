"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "1. Where can I buy Noble Mosaic physical coloring books?",
    answer:
      "You can purchase Noble Mosaic coloring books on Amazon. They are available in many countries including the United States, United Kingdom, Canada, Australia, and more.",
  },
  {
    question: "2. Where can I share my finished coloring pages?",
    answer: (
      <>
        We’d love to see your creations! Share your finished pages on{" "}
        <a href="https://www.instagram.com/noblemosaic/" target="_blank" rel="noopener noreferrer" className="text-[var(--mosaic-teal)] hover:underline font-medium">Instagram</a> or{" "}
        <a href="https://www.tiktok.com/@noblemosaic" target="_blank" rel="noopener noreferrer" className="text-[var(--mosaic-teal)] hover:underline font-medium">TikTok</a> at @noblemosaic and don’t forget to tag #noblemosaic and #noblemosaiccoloring. You can also join our Facebook Group:{" "}
        <a href="https://www.facebook.com/groups/noblemosaiccoloringcommunity" target="_blank" rel="noopener noreferrer" className="text-[var(--mosaic-teal)] hover:underline font-medium">Noble Mosaic Coloring Community</a> to connect with other coloring fans.
      </>
    ),
  },
  {
    question: "3. How can I contact Noble Mosaic for support?",
    answer: (
      <>
        For support or questions, email us at{" "}
        <a href="mailto:noblemosaic@gmail.com" className="text-[var(--mosaic-teal)] hover:underline font-medium">noblemosaic@gmail.com</a>. You can also send us a direct message on our social media channels:{" "}
        <a href="https://www.instagram.com/noblemosaic/" target="_blank" rel="noopener noreferrer" className="text-[var(--mosaic-teal)] hover:underline font-medium">Instagram</a>,{" "}
        <a href="https://www.facebook.com/noblemosaiccoloring" target="_blank" rel="noopener noreferrer" className="text-[var(--mosaic-teal)] hover:underline font-medium">Facebook</a>, or{" "}
        <a href="https://www.tiktok.com/@noblemosaic" target="_blank" rel="noopener noreferrer" className="text-[var(--mosaic-teal)] hover:underline font-medium">TikTok</a>.
      </>
    ),
  },
];

export default function FAQSection() {
  return (
    <section className="py-12 md:py-16 bg-white/30 backdrop-blur-md">
      <div className="layout-inner max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-800 text-center mb-8">
          FAQS
        </h2>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-neutral-200">
              <AccordionTrigger className="text-left font-semibold text-neutral-800 hover:text-[var(--mosaic-teal)] py-4 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-600 leading-relaxed pb-4 whitespace-pre-line">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
