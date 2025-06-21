import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/context/PlayerContext';
import logo from '@/assets/logo.png';

const Header = () => {
  const { currentPlayer, togglePlayer, playerNames } = usePlayer();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Bank Bonus Tracker" className="h-10 w-auto" />
          <span className="text-xl font-bold text-primary hidden md:inline">Bank Bonus Tracker</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-primary font-medium">Dashboard</Link>
          <Link to="/bonuses" className="text-gray-700 hover:text-primary font-medium">Bonuses</Link>
          <Link to="/tracking" className="text-gray-700 hover:text-primary font-medium">My Tracking</Link>
          <Link to="/comparison" className="text-gray-700 hover:text-primary font-medium">Comparison</Link>
          <Link to="/settings" className="text-gray-700 hover:text-primary font-medium">Settings</Link>
        </nav>

        {/* Player Toggle */}
        <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-full p-1">
          <Button
            variant={currentPlayer === 1 ? "default" : "ghost"}
            size="sm"
            className={`rounded-full ${currentPlayer === 1 ? '' : 'hover:bg-gray-200'}`}
            onClick={() => currentPlayer !== 1 && togglePlayer()}
          >
            {playerNames[1]}
          </Button>
          <Button
            variant={currentPlayer === 2 ? "default" : "ghost"}
            size="sm"
            className={`rounded-full ${currentPlayer === 2 ? '' : 'hover:bg-gray-200'}`}
            onClick={() => currentPlayer !== 2 && togglePlayer()}
          >
            {playerNames[2]}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            {/* Player Toggle for Mobile */}
            <div className="flex items-center justify-center space-x-2 bg-gray-100 rounded-full p-1 mx-auto">
              <Button
                variant={currentPlayer === 1 ? "default" : "ghost"}
                size="sm"
                className={`rounded-full ${currentPlayer === 1 ? '' : 'hover:bg-gray-200'}`}
                onClick={() => currentPlayer !== 1 && togglePlayer()}
              >
                {playerNames[1]}
              </Button>
              <Button
                variant={currentPlayer === 2 ? "default" : "ghost"}
                size="sm"
                className={`rounded-full ${currentPlayer === 2 ? '' : 'hover:bg-gray-200'}`}
                onClick={() => currentPlayer !== 2 && togglePlayer()}
              >
                {playerNames[2]}
              </Button>
            </div>

            {/* Mobile Navigation Links */}
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary font-medium py-2 text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/bonuses" 
              className="text-gray-700 hover:text-primary font-medium py-2 text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Bonuses
            </Link>
            <Link 
              to="/tracking" 
              className="text-gray-700 hover:text-primary font-medium py-2 text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Tracking
            </Link>
            <Link 
              to="/comparison" 
              className="text-gray-700 hover:text-primary font-medium py-2 text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Comparison
            </Link>
            <Link 
              to="/settings" 
              className="text-gray-700 hover:text-primary font-medium py-2 text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

