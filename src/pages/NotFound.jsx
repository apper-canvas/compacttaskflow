import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function NotFound() {
  const navigate = useNavigate();
  const HomeIcon = getIcon('Home');
  const FileQuestionIcon = getIcon('FileQuestion');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-surface-50 dark:bg-surface-900"
    >
      <div className="w-full max-w-lg text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mb-8 p-6 rounded-full bg-surface-100 dark:bg-surface-800 inline-block"
        >
          <FileQuestionIcon className="h-20 w-20 text-primary" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-surface-800 dark:text-surface-100"
        >
          404
        </motion.h1>
        
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold mb-4 text-surface-800 dark:text-surface-100"
        >
          Page Not Found
        </motion.h2>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-surface-600 dark:text-surface-400 mb-8 text-lg"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl 
            flex items-center justify-center mx-auto shadow-lg transition-all duration-300"
        >
          <HomeIcon className="h-5 w-5 mr-2" />
          Return Home
        </motion.button>
      </div>
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary opacity-5 rounded-full blur-3xl"></div>
      </div>
    </motion.div>
  );
}

export default NotFound;