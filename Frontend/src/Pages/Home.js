// src/components/Homepage.js
import React, { useState, useEffect } from "react";
import "../CSS/home.css";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import styles
import Spinner from "../Components/Spinner";
const Home = ({ showNavs = true, autoSlide = true, slideInterval = 5000 }) => {
    const [quote, setQuote] = useState('');
    const [author, setAuthor] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchQuote = async () => {
        try {
            setLoading(true);
            //https://api.api-ninjas.com/v1/quotes?category=happiness
            const response = await axios.get('https://api.api-ninjas.com/v1/quotes', {
                headers: { 'X-Api-Key': 'buAZSVwYWRt5Or4FmD5KLw==MIEddd3RSlMnoXv5' },
            });
            const data = response.data[0];
            setQuote(data.quote);
            setAuthor(data.author);
            // toast.success("HI");
        } catch (error) {
            console.error('Error fetching the quote:', error);
            setQuote('Unable to fetch quote at this time. Please try again later.');
            setAuthor('');
        }
        setLoading(false);
    };

    const slides = [
        {
            image: "/Images/homeimages/4.jpg",
            text: "Good Health Conscious Living",
            button1: "About Us",
            button2: "Contact",
            link1: "/about",  // Add link for button1
            link2: "/contact",  // Add link for button2
        },
        {
            image: "/Images/homeimages/1.jpg",
            text: "Green Agriculture Practices",
            button1: "Learn More",
            button2: "Join Us",
            link1: "/login",  // Add link for button1
            link2: "/login",  // Add link for button2
        },
        {
            image: "/Images/homeimages/10.jpg",
            text: "Empowering Farmers",
            button1: "Get Started",
            button2: "Explore",
            link1: "/login",  // Add link for button1
            link2: "/login",  // Add link for button2
        },
        {
            image: "/Images/homeimages/3.jpg",
            text: "Empowering Farmers",
            button1: "Get Started",
            button2: "Explore",
            link1: "/login",  // Add link for button1
            link2: "/login",  // Add link for button2
        },
        {
            image: "/Images/homeimages/6.jpg",
            text: "Empowering Farmers",
            button1: "Get Started",
            button2: "Explore",
            link1: "/login",  // Add link for button1
            link2: "/login",  // Add link for button2
        }
    ];

    const cards = [
        {
            icon: "🛠️",
            title: "Industry Oriented",
            description: "Enabling ecosystem for food agriculture.",
        },
        {
            icon: "🚜",
            title: "Modern Truck",
            description: "The mission of Agroly is to facilitate.",
        },
        {
            icon: "🌱",
            title: "Farm Plans",
            description: "Latest analysis by the Cadre Harmonisé.",
        },
        {
            icon: "✔️",
            title: "Service Guarantee",
            description: "The Food and Agriculture Organization.",
        },
    ];


    const cards2 = [
        { icon: "🌱", title: "Vegetables", text: "Homes and thoroughly launder them between usage. We give our teams." },
        { icon: "🍍", title: "Fresh Fruits", text: "We are closely monitoring national, state and local health developments." },
        { icon: "🐄", title: "Healthy Cattle", text: "Follow these tips from the CDC to help prevent the spread of the seasonal." },
        { icon: "🌾", title: "Natural Wheats", text: "Industra plays a large role in the comfort of your home, but many." },
        { icon: "🚜", title: "Modern Truck", text: "We realize that every family has their own preferences, so we accommodate." },
        { icon: "🌅", title: "Farm Plans", text: "While some cleaning companies use rotating cleaning plans, we’re equipped." },
    ];

    const testimonials = [
        {
            name: 'Sophia Johnson',
            title: 'Product Manager',
            quote: "Innovation is the key to success. Always challenge the status quo and push boundaries.",
            image: '/Images/test1.jpeg'
        },
        {
            name: 'Liam Anderson',
            title: 'Software Engineer',
            quote: "Every problem is an opportunity to learn and grow. Embrace the journey.",
            image: '/Images/test2.jpeg'
        },
        {
            name: 'Olivia Martinez',
            title: 'Creative Director',
            quote: "Creativity is intelligence having fun. Let your imagination run wild.",
            image: '/Images/test3.jpeg'
        },
    ];
    

    const [userCount, setUserCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [farmer, setFarmer] = useState(0);
    const [dealer, setDealer] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            const response = await fetch('https://farmer-s-market-theta.vercel.app/server/count');
            const data = await response.json();
            // // console.log(data);
            setUserCount(data.userCount);
            setOrderCount(data.orderCount);
            setFarmer(data.farmer);
            setDealer(data.Dealer);
        };

        fetchCounts();
    }, []);



    const stats = [
        {
            icon: '/Images/stats1.png',
            number: userCount,
            label: 'HAPPY CUSTOMERS'
        },
        {
            icon: '/Images/stats2.png',
            number: orderCount,
            label: 'COMPLETE ORDERS'
        },
        {
            icon: '/Images/stats3.png',
            number: farmer,
            label: 'HAPPY FARMER'
        },
        {
            icon: '/Images/stats3.png',
            number: dealer,
            label: 'HAPPY DEALER'
        },
        // ... other stats
    ];


    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (autoSlide) {
            const interval = setInterval(() => {
                setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
            }, slideInterval); // Slide interval (e.g., 3 seconds)
            return () => clearInterval(interval);
        }
        fetchQuote();
    }, [slides.length, autoSlide, slideInterval]);

    const goToNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prevSlide) =>
            prevSlide === 0 ? slides.length - 1 : prevSlide - 1
        );
    };

    const [activeIndex, setActiveIndex] = useState(0);

    const handleDotClick = (index) => {
        setActiveIndex(index);
    };



    return (
        <>
            <NavBar />
            <ToastContainer />
            <div className="homepage">

                <div className="homepage-slider">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`slide ${index === currentSlide ? "active" : ""}`}
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            <div className="slide-content">
                                <h1 className="texti">{slide.text}</h1>
                                <div className="buttons">
                                    <a href={slide.link1} className="btn-primary">
                                        {slide.button1}
                                    </a>
                                    <a href={slide.link2} className="btn-secondary">
                                        {slide.button2}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dots Navigation */}
                {/* </div> */}
                <div>
                    <div className="dots-container">
                        {slides.map((_, index) => (
                            <div
                                key={index}
                                className={`dot ${index === currentSlide ? "active" : ""}`}
                                onClick={() => setCurrentSlide(index)} // Update slide on click
                            ></div>
                        ))}
                    </div>
                </div>
                <div className="card-section">
                    {cards.map((card, index) => (
                        <div key={index} className="card">
                            <div className="card-icon">{card.icon}</div>
                            <h3 className="card-title">{card.title}</h3>
                            <p className="card-description">{card.description}</p>
                        </div>
                    ))}
                </div>
                <div className="about-section">
                    {/* Left Side: Image */}
                    <div className="about-image">
                        <img
                            src="/Images/logo.jpg" // Replace with your image URL
                            alt="Agriculture Growth"
                        />
                    </div>

                    {/* Right Side: Content */}
                    <div className="about-content">
                        <h3 className="subheading">About AgriHaven</h3>
                        <h1 className="heading">Bringing Growth To Agriculture</h1>
                        <p className="description">
                            Our goal at Agri Shop is to improve farmers' quality of life by giving them the resources, knowledge, and market access they require to succeed.
                        </p>
                        <p className="description">
                            We provide smallholder farmers with individualized guidance and tactics, utilizing data-driven insights and contemporary farming methods to enable more informed decision-making. By integrating scalable solutions with precision agriculture, we assist farmers in increasing their output and financial success.
                        </p>

                        {/* Features */}
                        <div className="features">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div>
                                    <h4>Service Guarantee</h4>
                                    <p>
                                        Our services ensure the best quality for smallholder farmers, dealers and shopkeepers to help them grow sustainably.
                                    </p>
                                </div>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-leaf"></i>
                                </div>
                                <div>
                                    <h4>Market Research</h4>
                                    <p>
                                        We research the best market opportunities for smallholder farmers in emerging economies.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="maincon">
                    <div className="image-section">
                        <img src="/Images/logo.jpg" alt="Image" />
                    </div>
                    <div className="content-section">
                        <div className="content-sec">
                            <h1 className="header1">WHY CHOOSE US</h1>
                            <h2 className="header2">We Empower Farmers, Dealers and Transform Agriculture.</h2>
                            <p className="header3">Discover a platform that connects you to fresh products, innovative tools, and sustainable solutions, all designed to help you grow and thrive.</p>
                        </div>
                        <div className="content-sec2">
                            <div className="icon-container">
                                <img src="/Images/section1.png" className="trans-image" alt="Icon 1" />
                                <h2 className="xx">Extended Warranty</h2>
                                <p>We put the extra in your ordinary for the balance life.</p>
                            </div>
                            <div className="icon-container">
                                <img src="/Images/section2.png" className="trans-image" alt="Icon 2" />
                                <h2>Friendly Support</h2>
                                <p>The Industrial is responsible for minor and the codes..</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-layout">
                    <div className="card-container">
                        {cards2.map((card, index) => (
                            <div key={index} className="card">
                                <span className="card-icon">{card.icon}</span>
                                <h3 className="card-title">{card.title}</h3>
                                <p className="card-text">{card.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="ddd">
                    <div className="video-section">
                        <h2 className="video-title">See How We're Transforming Agriculture</h2>
                        <p className="video-description">Watch our video to learn about our mission, vision, and the impact we’re making in the agricultural community.</p>
                        <video controls className="homepage-video">
                            <source src="/Images/homeimages/video.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
                <div className="qm">
                    <div className="sm">
                        <h2 >We Are Always Ready to Help You</h2>
                        {loading ? (
                            <Spinner/>
                        ) : (
                            <>
                                <p className="quote">{quote}</p>
                                <p className="author">{author && `- ${author}`}</p>
                                <button className="get-quote-button" onClick={fetchQuote}>GET A QUOTE</button>
                            </>
                        )}
                    </div>
                </div>
                <div className="mains">
                    <div className="testimonials">
                        {testimonials.map((testimonial, index) => (
                            <div className={`testimonialcard ${index === activeIndex ? 'active' : ''}`} key={index}>
                                <div className="quote-icon">
                                    <img src="/Images/q.png" alt="Quote Icon" className="q" />
                                </div>
                                <p className="tquote">{testimonial.quote}</p>
                                <div className="styles-line"></div>
                                <div className="userinfo">
                                    <img src={testimonial.image} alt={testimonial.name} />
                                    <div>
                                        <h4>{testimonial.name}</h4>
                                        <p>{testimonial.title}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                    <div className="dots">
                        {testimonials.map((_, index) => (
                            <span key={index} className={`dot ${index === activeIndex ? 'active' : ''}`} onClick={() => handleDotClick(index)}></span>
                        ))}
                    </div>
                    <div className="stats-section">
                        {stats.map((stat, index) => (
                            <div className="stat-card" key={index}>
                                <img src={stat.icon} alt={stat.label} />
                                <div>
                                    <h1>{stat.number}</h1>
                                    <p>{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div >
            <Footer />
        </>
    );
};

export default Home;
