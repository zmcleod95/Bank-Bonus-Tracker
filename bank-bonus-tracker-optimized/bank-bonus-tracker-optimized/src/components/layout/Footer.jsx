import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              &copy; {currentYear} Bank Bonus Tracker. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link to="/" className="text-sm text-gray-600 hover:text-primary">
              Dashboard
            </Link>
            <Link to="/bonuses" className="text-sm text-gray-600 hover:text-primary">
              Bonuses
            </Link>
            <Link to="/tracking" className="text-sm text-gray-600 hover:text-primary">
              My Tracking
            </Link>
            <Link to="/settings" className="text-sm text-gray-600 hover:text-primary">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

