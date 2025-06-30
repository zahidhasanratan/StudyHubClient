import { FaBookOpen } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content py-10 px-6 md:px-20 grid md:grid-cols-3 gap-12">
      <aside>
        <h2 className="text-2xl font-bold text-primary mb-2">
          <a className="text-2xl font-extrabold text-primary tracking-tight flex items-center gap-2">
            <FaBookOpen className="text-primary w-6 h-6" />
            GroupStudyHub
          </a>
        </h2>
        <p className="text-sm">
          Your go-to platform for collaborative learning. Built with modern web
          technologies and a focus on community.
        </p>
      </aside>

      <nav className="flex flex-col gap-2">
        <h6 className="footer-title mb-2 font-bold">Quick Links</h6>
        <Link to="/assignments" className="link link-hover">
          Assignments
        </Link>
        <Link to="/create-assignment" className="link link-hover">
          Create Assignment
        </Link>
        <Link to="/login" className="link link-hover">
          Login
        </Link>
      </nav>

      <nav className="flex flex-col gap-2">
        <h6 className="footer-title mb-2 font-bold">Contact Us</h6>
        <a className="link link-hover">support@groupstudyhub.com</a>
        <a className="link link-hover">+81 123 456 789</a>
        <a className="link link-hover">Tokyo, Japan</a>
      </nav>
    </footer>
  );
};

export default Footer;
