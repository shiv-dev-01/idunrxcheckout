import React, { useState } from 'react';
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import './faq.css';


const FAQItem = ({ question, answer, isOpen, toggleAnswer }) => {
    return (
        <>
        
        <div className={`faq-item ${isOpen ? 'open' : ''}`}>
            <button className="faq-question" onClick={toggleAnswer}>
                {question}
                <span className="faq-icon">
                    {isOpen ? <FaChevronUp className='FaChevronUp' /> : <FaChevronDown className='FaChevronDown' />}
                </span>
            </button>
            {isOpen && <div className="faq-answer">{answer}</div>}
        </div>
        </>
    );
};

const FAQList = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAnswer = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "WHAT ARE GLP-1 MEDICATIONS (SEMAGLUTIDE, TIRZEPATIDE)?",
            answer: (
                <div>
                    <p>GLP-1 medications are a class of prescription drugs that not only improves blood sugar control but may also lead to weight loss. This class of drugs is commonly called glucagon-like peptide 1 (GLP-1) agonists. Weight loss can vary, depending on which GLP-1 drug you use and the dosage. Studies found people using Semaglutide and making lifestyle changes lost about 33.7 pounds (15.3 kilograms) versus 5.7 pounds (2.6 kilograms) in those who didn’t use the drug. GLP-1 medications are generally taken by an injection given weekly, depending on the drug (Semaglutide, Tirzepatide).</p>
                    <p>Some of the more common side effects include: <br />
                        Nausea, Vomiting, Diarrhea</p>
                    <p>Side effects can often be mitigated by correctly titrating your dosage upward, so you’ll want to ensure that you are taking the medication exactly as prescribed by your provider to minimize risk and/or severity of side effects. Anti-nausea medications such as ondansetron (generic Zofran) are also helpful to assist in mitigating nausea.</p>
                    <p>Low blood sugar levels (hypoglycemia) are a more serious risk linked to the GLP-1 class of drugs. But the risk of low blood sugar levels often only goes up if you’re also taking another drug known to lower blood sugar at the same time, such as sulfonylureas or insulin. The GLP-1 class of drugs isn’t recommended if you have a personal or family history of medullary thyroid cancer or multiple endocrine neoplasia. Lab studies have linked these drugs with thyroid tumors in rats. But until more long-term studies are done, the risk to humans isn’t known. The GLP-1 class of drugs is also not recommended if you’ve had pancreatitis.</p>
                    <p>References: https://www.mayoclinic.org/diseases-conditions/type-2-diabetes/expert-answers/byetta/faq-20057955</p>
                </div>
            )
        },
        {
            question: "HOW TO USE GLP-1 MEDICATIONS?",
            answer: (
                <div>
                    <p>Semaglutide and Tirzepatide are injected below the skin once a week.  Your doctor will prescribe a dose that is custom for you.  Usually, you will start a low dose and work your way up to a higher dose over a number of weeks.  Some tips on how to use:</p>
                    <ul>
                        <li><b>Choose an injection site:</b> Common injection sites include the abdomen, thigh or upper arm.  Rotate injection sites to prevent hardening of the skin.</li>
                        <li><b>Prepare to inject: </b> Wash your hands thoroughly.  Draw up your custom dose from the vial and into the syringe.</li>
                        <li><b>Clean your injection site: </b> Use an alcohol swab to clean the injection site.</li>
                        <li><b>Administer the injection:  </b>Inject the medication under the skin as directed by your doctor.</li>
                    </ul>
                    <p><b>Needle safety:</b> Once you inject, dispose of the used needle and syringe into an appropriate Sharps container. </p>
                </div>
            )
        },
        {
            question: "HOW TO TAKE SEMAGLUTIDE/TIRZEPATIDE?",
            answer: (
                <div>
                    <p>It is important to follow the prescribed doses and directions from your provider accurately in order to minimize risk and/or severity of potential side effects. If you have any questions regarding how to properly take your medication once you receive it, please reach out to us before taking for proper guidance from a licensed medication professional. Taking doses other than what is prescribed by your provider may have unintended and potentially dangerous side effects.</p>
                </div>
            )
        },
        {
            question: "WHAT CAN I EXPECT FROM GLP-1 THERAPY?",
            answer: (
                <div>
                    <p> Semaglutide and Tirzepatide therapy take about 2 weeks to start working.  Some people start to see a reduction in hunger even sooner.  Your doctor will slowly increase your dose over a number of weeks to minimize side effects.  The speed of weight loss varies between individuals but generally weight loss is assessed around week 12 once you get to your higher dose.  Stick with it! As you can see, the results can be profound: </p>

                    <p> A study of 2,000 obese adults compared people using Semaglutide plus a diet and exercise program with people who made the same lifestyle changes without Semaglutide. After 68 weeks, half of the participants using Semaglutide lost 15% of their body weight, and nearly a third lost 20%. Participants who incorporated only lifestyle changes lost only about 2.4% of their body weight.   </p>

                    <p> Similar trials for Tirzepatide showed even greater results.  A study of over 600 obese adults using Tirzepatide showed that over 80% of participants lost greater than 15% of their body weight.  Additionally, over 36% of participants lost greater than 25% of their body weight when taking the higher dose of Tirzepatide. </p>
                </div>
            )
        },
        {
            question: "WHAT ARE SIDE EFFECTS AND PRECAUTIONS OF GLP-1 THERAPY?",
            answer: (
                <div>
                    <p>Like any medication, GLP-1 medications may cause side effects. It’s essential to be aware of potential side effects and promptly report any concerns to your doctor. Common side effects may include:</p>
                    <ul>
                        <li><b>Gastrointestinal Issues: </b> Nausea, vomiting, diarrhea, and abdominal pain are common side effects, especially when starting the medication. These symptoms often improve over time.</li>
                        <li><b>Hypoglycemia:</b> While GLP-1 medications themselves are less likely to cause low blood sugar (hypoglycemia) when used alone, combining it with other medications that lower blood sugar or insulin can increase the risk of hypoglycemia.</li>
                        <li><b>Injection Site Reactions:  </b> Some individuals may experience redness, swelling, or itching at the injection site.</li>
                        <li><b>Thyroid Tumors:  </b>In animal studies, GLP-1 medications have been associated with an increased risk of thyroid tumors. It’s essential to discuss any concerns with your healthcare provider, who can assess the risks and benefits for your specific situation.</li>
                        <li><b>Pancreatitis:  </b>There have been reports of pancreatitis (inflammation of the pancreas) with GLP-1 receptor agonists.  Inform your doctor if you experience severe abdominal pain.</li>
                        <li><b>Allergic Reactions:  </b>While rare, allergic reactions such as rash, itching, or severe dizziness can occur.  Seek medical attention if you experience these symptoms.</li>
                    </ul>
                    <p><b>Needle safety:</b> Once you inject, dispose of the used needle and syringe into an appropriate Sharps container. </p>
                </div>
            )
        },
        {
            question: "What should I do if I miss a dosage?",
            answer: (
                <div>
                    <p>Since Semaglutide and Tirzepatide are injected just once a week, if you miss your injection day, take your injection as soon as you remember as long as it’s within 5 days after your missed dose. If more than 5 days have passed, skip the missed dose and take your next dose on your regularly scheduled day.</p>
                </div>
            )
        },
        {
            question: "How should I store GLP-1 medications like Semaglutide/Tirzepatide?",
            answer: (
                <div>
                    <p>These medications should be stored in the refrigerator between doses. GLP-1 medications are sensitive to temperature and could degrade if not stored properly.</p>
                </div>
            )
        },
        {
            question: "When should I take my dose of Semaglutide/Tirzepatide?",
            answer: (
                <div>
                    <p>You can take GLP-1 medications at any time during the day, without regard to meals. If your dosage is prescribed to take weekly, you should take your dose on the same day each week.</p>
                </div>
            )
        },
        {
            question: "Can I take a dosage that I've already been on if I'm switching to you from another doctor?",
            answer: (
                <div>
                    <p>Please discuss your previous prescription and dosage with your provider during your medical intake process when enrolling and if medically appropriate, your provider will coordinate your dosage accordingly.</p>
                </div>
            )
        },
    ];

    return (
        <section className="faq-section">
            <h2>FREQUENTLY ASKED QUESTIONS</h2>
            {faqs.map((faq, index) => (
                <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === index}
                    toggleAnswer={() => toggleAnswer(index)}
                />
            ))}
        </section>
    );
};

export default FAQList;
