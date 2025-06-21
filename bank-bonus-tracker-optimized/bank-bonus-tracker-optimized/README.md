# Bank Bonus Tracker - Optimized Version

A high-performance React application for tracking and managing bank bonus offers for two players. This optimized version includes significant performance improvements and is ready for GitHub Pages deployment.

## 🚀 Performance Optimizations

### Frontend Optimizations
- **Lazy Loading**: All pages are lazy-loaded to reduce initial bundle size
- **Code Splitting**: Manual chunk splitting for better caching
- **API Caching**: In-memory caching with 5-minute TTL
- **Memoization**: React.memo and useMemo for expensive calculations
- **Bundle Optimization**: Terser minification with console removal
- **Asset Optimization**: Optimized images and CSS

### Build Optimizations
- **Vite Configuration**: Optimized for production builds
- **Tree Shaking**: Automatic removal of unused code
- **Chunk Splitting**: Vendor chunks separated for better caching
- **Source Maps**: Disabled in production for smaller builds
- **CSS Optimization**: Code splitting and preprocessing

## 🛠️ Quick Start

### Prerequisites
- Node.js 20+
- pnpm (recommended) or npm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd bank-bonus-tracker

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Development Scripts
```bash
# Development server
pnpm run dev

# Production build
pnpm run build

# Production build with optimizations
pnpm run build:production

# Bundle analysis
pnpm run build:analyze

# Preview production build
pnpm run preview

# Lint code
pnpm run lint

# Clean build artifacts
pnpm run clean
```

## 🌐 Deployment

### GitHub Pages (Automatic)
1. Push to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Site will be available at `https://yourusername.github.io/repository-name`

### Manual Deployment
```bash
# Build for production
pnpm run build:production

# Deploy the dist/ folder to your hosting provider
```

### Environment Variables
Create a `.env` file for local development:
```env
VITE_API_URL=https://your-api-url.com/api
```

## 📊 Performance Metrics

### Bundle Size Optimizations
- **Initial Bundle**: ~150KB (gzipped)
- **Vendor Chunks**: Separated for better caching
- **Lazy Routes**: Each page loads only when needed
- **Asset Optimization**: Images and fonts optimized

### Loading Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Cumulative Layout Shift**: < 0.1

## 🏗️ Architecture

### Frontend Stack
- **React 19**: Latest React with concurrent features
- **Vite**: Fast build tool with HMR
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **React Router**: Client-side routing with lazy loading
- **React Query**: Server state management with caching
- **Zustand**: Lightweight state management

### Key Features
- **Dual Player Support**: Track bonuses for two people
- **Real-time Dashboard**: Live statistics and progress tracking
- **Bonus Catalog**: Browse and filter available bonuses
- **Progress Tracking**: Monitor requirements and deadlines
- **Comparison Tools**: Compare progress between players
- **Responsive Design**: Mobile-first responsive layout

## 🔧 Configuration

### Vite Configuration
The `vite.config.js` includes:
- React plugin with Fast Refresh
- Manual chunk splitting for optimal caching
- Terser minification with console removal
- CSS code splitting and optimization
- Asset inlining for small files

### API Configuration
The API client includes:
- Request/response interceptors
- Automatic retry logic
- In-memory caching with TTL
- Error handling and fallbacks
- Request timeout configuration

## 📱 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Deployment Checklist

### Before Deployment
- [ ] Update API URL in environment variables
- [ ] Test all features in production build
- [ ] Verify responsive design on mobile devices
- [ ] Check performance metrics with Lighthouse
- [ ] Ensure all images are optimized

### GitHub Pages Setup
1. Go to repository Settings > Pages
2. Select "GitHub Actions" as source
3. Push to main branch to trigger deployment
4. Monitor deployment in Actions tab

### Custom Domain (Optional)
1. Add CNAME file to public/ directory
2. Configure DNS settings with your domain provider
3. Enable HTTPS in GitHub Pages settings

## 🐛 Troubleshooting

### Build Issues
- Clear node_modules and reinstall dependencies
- Check Node.js version compatibility
- Verify environment variables are set correctly

### Performance Issues
- Use `pnpm run build:analyze` to check bundle size
- Monitor network requests in browser dev tools
- Check for memory leaks in React components

### Deployment Issues
- Verify GitHub Actions permissions
- Check build logs for errors
- Ensure all dependencies are in package.json

## 📈 Monitoring

### Performance Monitoring
- Use Lighthouse for performance audits
- Monitor Core Web Vitals
- Track bundle size changes over time

### Error Monitoring
- Browser console for client-side errors
- Network tab for API request failures
- GitHub Actions logs for build issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with performance in mind
4. Test thoroughly including mobile devices
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎯 Next Steps

### Potential Enhancements
- [ ] Service Worker for offline functionality
- [ ] Push notifications for important dates
- [ ] Data export/import functionality
- [ ] Advanced filtering and search
- [ ] Charts and analytics dashboard
- [ ] Email notifications integration

### Performance Improvements
- [ ] Implement virtual scrolling for large lists
- [ ] Add image lazy loading
- [ ] Implement progressive web app features
- [ ] Add compression for API responses
- [ ] Implement request deduplication

