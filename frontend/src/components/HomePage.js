import React, { useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PropTypes from 'prop-types'; 
import styles from '../styles/HomePage.module.css';
import {
  Container,
  Button,
  Row,
  Col,
  Image,
  Card,
} from 'react-bootstrap';
import { FaVideo, FaCheckCircle, FaUsers, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';





function HomePage() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (auth.token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
 


  // Animation Variants
  const heroVariant = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  const featureVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  const testimonialVariant = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>

    

      {/* Hero Section */}
      <section className={styles.hero}>
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
          <Row className="text-center">
            <Col>
              {/* Animated Image */}
              <motion.div
                variants={heroVariant}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1 }}
              >
                <Image
                  src="/video.jpg" 
                  alt="VideoApp Illustration"
                  fluid
                  className={`mb-4 ${styles.landingImage}`}
                />
              </motion.div>
              {/* Animated Headline */}
              <motion.h1
                className="display-4"
                variants={heroVariant}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1, delay: 0.5 }}
              >
                Welcome to VideoApp
              </motion.h1>
              {/* Animated Subheadline */}
              <motion.p
                className="lead"
                variants={heroVariant}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1, delay: 0.7 }}
              >
                Your one-stop solution for video processing and management.
              </motion.p>
              {/* Animated Call-to-Action Button */}
              <motion.div
                variants={heroVariant}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1, delay: 0.9 }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGetStarted}
                  aria-label="Get Started with VideoApp"
                  className="mt-3"
                >
                  <FaVideo className="me-2" />
                  Get Started
                </Button>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <Container>
          <Row className="mb-5">
            <Col>
              <h2 className="text-center">Features</h2>
              <p className="text-center text-muted">
                Discover what VideoApp can do for you.
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <motion.div
                className="featureItem"
                variants={featureVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <FaCheckCircle className={`featureIcon ${styles.featureIcon}`} />
                <h4 className="featureTitle">Easy Uploads</h4>
                <p className="featureDescription">
                  Seamlessly upload your videos with our intuitive interface.
                </p>
              </motion.div>
            </Col>
            <Col md={4} className="mb-4">
              <motion.div
                className="featureItem"
                variants={featureVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <FaUsers className={`featureIcon ${styles.featureIcon}`} />
                <h4 className="featureTitle">User Management</h4>
                <p className="featureDescription">
                  Manage your user base efficiently with our robust tools.
                </p>
              </motion.div>
            </Col>
            <Col md={4} className="mb-4">
              <motion.div
                className="featureItem"
                variants={featureVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <FaShieldAlt className={`featureIcon ${styles.featureIcon}`} />
                <h4 className="featureTitle">Secure Storage</h4>
                <p className="featureDescription">
                  Keep your videos safe with our top-notch security measures.
                </p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <Container>
          <Row className="mb-5">
            <Col>
              <h2 className="text-center">What Our Users Say</h2>
              <p className="text-center text-muted">
                Hear from those who have benefited from VideoApp.
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-4">
              <motion.div
                className="testimonialItem"
                variants={testimonialVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Text className={styles.testimonialText}>
                      "It's user-friendly and incredibly efficient!"
                    </Card.Text>
                    <Card.Title className={styles.testimonialAuthor}>
                      - Harish Bansal
                    </Card.Title>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={6} className="mb-4">
              <motion.div
                className="testimonialItem"
                variants={testimonialVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Text className={styles.testimonialText}>
                      "The user management features are top-notch. The Api that processes Video is fast and Amazing."
                    </Card.Text>
                    <Card.Title className={styles.testimonialAuthor}>
                      - Vikas Mishra
                    </Card.Title>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer Section */}
      <footer className={styles.footer}>
        <Container>
          <Row>
            <Col md={4} className="mb-3">
              <h5>VideoApp</h5>
              <p>Your one-stop solution for video processing and management.</p>
            </Col>
            <Col md={4} className="mb-3">
              <h5>Links</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="/features">Features</a>
                </li>
                <li>
                  <a href="/pricing">Pricing</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
                </li>
              </ul>
            </Col>
            <Col md={4} className="mb-3">
              <h5>Follow Us</h5>
              <ul className="list-unstyled d-flex">
                <li className="me-3">
                  <a href="https://facebook.com" aria-label="Facebook">
                    <FaUsers size={24} />
                  </a>
                </li>
                <li className="me-3">
                  <a href="https://twitter.com" aria-label="Twitter">
                    <FaShieldAlt size={24} />
                  </a>
                </li>
                <li className="me-3">
                  <a href="https://instagram.com" aria-label="Instagram">
                    <FaVideo size={24} />
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
          <Row>
            <Col className="text-center">
              <p className="mb-0">&copy; {new Date().getFullYear()} VideoApp. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}

export default HomePage;

