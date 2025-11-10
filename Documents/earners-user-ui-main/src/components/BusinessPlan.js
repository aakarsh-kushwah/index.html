import React, { useState, useEffect } from 'react';
import './BusinessPlan.css';

const BusinessPlan = () => {
    const [isHindi, setIsHindi] = useState(false);

    const toggleLanguage = () => {
        setIsHindi(prev => !prev);
    };

    return (
        <div className="business-plan-container">
            <div className="language-toggle-container">
                <button className="language-toggle-button" onClick={toggleLanguage}>
                    <span id="language-icon">{isHindi ? '🇬🇧' : '🌐'}</span>
                    <span id="language-text">{isHindi ? 'View in English' : 'हिन्दी में देखें'}</span>
                </button>
            </div>

            {/* English Content */}
            <div id="english-content" style={{ display: isHindi ? 'none' : 'block' }}>
                <div className="container">
                    <header className="header">
                        <h1>🌐 EarnersWave</h1>
                        <p className="tagline">Built in India, Designed for the World – Your Path to Financial Freedom</p>
                    </header>

                    <section>
                        <h2>🚀 The Earning Plan</h2>
                        <div className="highlight-box">
                            <p>✅ **Activation:** One-time purchase of Gleam & Glam Kit for **₹1519**.</p>
                            <p>✅ **Direct Referrals:** Earn a flat **₹500** for every person you join directly!</p>
                            <p>✅ **Team Building:** Only **2 direct referrals** are required to unlock all team incomes.</p>
                        </div>
                    </section>

                    <section>
                        <h2>📊 The 3-Phase Income Journey</h2>
                        <p>Our plan is designed as a simple journey. You complete one phase and automatically move to the next, with your earnings increasing at each step.</p>
                        
                        {/* --- VISUAL TIMELINE STRUCTURE --- */}
                        <div className="timeline">
                            {/* Phase 1 */}
                            <div className="timeline-item">
                                <div className="timeline-icon">1</div>
                                <div className="timeline-content">
                                    <h3>Phase 1: Your Foundation</h3>
                                    <p><strong>Team Goal:</strong> 254 Members</p>
                                    <p><strong>Pair Matching Income:</strong> ₹100 per pair</p>
                                    <p className="total-income">Total Earnings: ₹12,700+</p>
                                    <p className="note">After this, repurchase the kit to enter the next phase with higher earnings!</p>
                                </div>
                            </div>

                            {/* Phase 2 */}
                            <div className="timeline-item">
                                <div className="timeline-icon">2</div>
                                <div className="timeline-content">
                                    <h3>Phase 2: Growth & Momentum</h3>
                                    <p><strong>Team Goal:</strong> 254 New Members</p>
                                    <p><strong>Pair Matching Income:</strong> ₹150 per pair</p>
                                    <p className="total-income">Total Earnings: ₹19,050+</p>
                                    <p className="note">Repurchase again to unlock the maximum earning potential in Phase 3.</p>
                                </div>
                            </div>

                            {/* Phase 3 */}
                            <div className="timeline-item">
                                <div className="timeline-icon">3</div>
                                <div className="timeline-content">
                                    <h3>Phase 3: Unlimited Potential</h3>
                                    <p><strong>Team Goal:</strong> 254 New Members</p>
                                    <p><strong>Pair Matching Income:</strong> ₹200 per pair</p>
                                    <p className="total-income">Total Earnings: ₹25,400+</p>
                                    <p className="note">From here, this phase **repeats automatically**, allowing you to earn ₹25,400+ again and again!</p>
                                </div>
                            </div>
                        </div>
                    </section>

                     <section>
                        <h2>🔁 Spill Over & Auto-Reconnect</h2>
                        <div className="highlight-box">
                            <p>Your team of 254 builds effortlessly thanks to the Spill Over system. Even after capping, your old team automatically reconnects under you, ensuring continuous growth and unlimited income!</p>
                        </div>
                    </section>

                    <footer className="contact-info">
                        <h2>Ready to Begin?</h2>
                        <p>Join the movement and start your journey towards financial freedom today.</p>
                        <a href="buying-product" target="_blank" rel="noopener noreferrer" className="cta-button">Join EarnersWave Now</a>
                    </footer>
                </div>
            </div>

            {/* Hindi Content */}
            <div id="hindi-content" style={{ display: isHindi ? 'block' : 'none' }}>
                <div className="container">
                     <header className="header">
                        <h1>🌐 अर्नर्सवेव</h1>
                        <p className="tagline">भारत में निर्मित, विश्व के लिए डिज़ाइन किया गया – आपके वित्तीय स्वतंत्रता का मार्ग</p>
                    </header>

                    <section>
                        <h2>🚀 कमाई का प्लान</h2>
                        <div className="highlight-box">
                            <p>✅ **एक्टिवेशन:** ग्लीम एंड ग्लैम किट की एक बार की खरीद **₹1519** में।</p>
                            <p>✅ **डायरेक्ट रेफरल:** आपके द्वारा सीधे ज्वाइन किए गए हर व्यक्ति पर फ्लैट **₹500** कमाएं!</p>
                            <p>✅ **टीम निर्माण:** सभी टीम इनकम को अनलॉक करने के लिए केवल **2 डायरेक्ट रेफरल** आवश्यक हैं।</p>
                        </div>
                    </section>
                    
                    <section>
                        <h2>📊 3-फेज की इनकम यात्रा</h2>
                        <p>हमारा प्लान एक सरल यात्रा के रूप में डिज़ाइन किया गया है। आप एक फेज पूरा करते हैं और स्वचालित रूप से अगले पर चले जाते हैं, प्रत्येक कदम पर आपकी कमाई बढ़ती है।</p>
                        
                        <div className="timeline">
                             <div className="timeline-item">
                                <div className="timeline-icon">१</div>
                                <div className="timeline-content">
                                    <h3>फेज 1: आपकी नींव</h3>
                                    <p><strong>टीम लक्ष्य:</strong> 254 सदस्य</p>
                                    <p><strong>पेयर मैचिंग इनकम:</strong> ₹100 प्रति पेयर</p>
                                    <p className="total-income">कुल कमाई: ₹12,700+</p>
                                    <p className="note">इसके बाद, अधिक कमाई के साथ अगले चरण में प्रवेश करने के लिए किट को फिर से खरीदें!</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-icon">२</div>
                                <div className="timeline-content">
                                    <h3>फेज 2: ग्रोथ और मोमेंटम</h3>
                                    <p><strong>टीम लक्ष्य:</strong> 254 नए सदस्य</p>
                                    <p><strong>पेयर मैचिंग इनकम:</strong> ₹150 प्रति पेयर</p>
                                    <p className="total-income">कुल कमाई: ₹19,050+</p>
                                    <p className="note">फेज 3 में अधिकतम कमाई क्षमता को अनलॉक करने के लिए फिर से खरीदें।</p>
                                </div>
                            </div>
                             <div className="timeline-item">
                                <div className="timeline-icon">३</div>
                                <div className="timeline-content">
                                    <h3>फेज 3: असीमित क्षमता</h3>
                                    <p><strong>टीम लक्ष्य:</strong> 254 नए सदस्य</p>
                                    <p><strong>पेयर मैचिंग इनकम:</strong> ₹200 प्रति पेयर</p>
                                    <p className="total-income">कुल कमाई: ₹25,400+</p>
                                    <p className="note">यहां से, यह चरण **स्वचालित रूप से दोहराता है**, जिससे आप बार-बार ₹25,400+ कमा सकते हैं!</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2>🔁 स्पिल ओवर और ऑटो-रीकनेक्ट</h2>
                        <div className="highlight-box">
                            <p>आपकी 254 की टीम स्पिल ओवर सिस्टम की बदौलत सहजता से बनती है। कैपिंग के बाद भी, आपकी पुरानी टीम स्वचालित रूप से आपके तहत फिर से जुड़ जाती है, जिससे निरंतर विकास और असीमित आय सुनिश्चित होती है!</p>
                        </div>
                    </section>

                    <footer className="contact-info">
                        <h2>शुरू करने के लिए तैयार हैं?</h2>
                        <p>आंदोलन में शामिल हों और आज ही वित्तीय स्वतंत्रता की ओर अपनी यात्रा शुरू करें।</p>
                        <a href="buying-product" target="_blank" rel="noopener noreferrer" className="cta-button">अर्नर्सवेव से अभी जुड़ें</a>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default BusinessPlan;