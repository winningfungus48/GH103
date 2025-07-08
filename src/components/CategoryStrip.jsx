import { useState } from 'react';
import styles from './CategoryStrip.module.css';
import { Link } from 'react-router-dom';

const tabs = ['A-Z Games', 'Favorites', '-le Games', 'Sports', 'See More'];

const CategoryStrip = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className={styles.categoryStrip}>
      {tabs.map((tab) =>
        tab === 'See More' ? (
          <Link
            key={tab}
            to="/categories"
            className={`${styles.tab} ${activeCategory === tab ? styles.active : ''}`}
            tabIndex={0}
            aria-current={activeCategory === tab ? 'page' : undefined}
            onClick={() => onCategoryChange(tab)}
          >
            {tab}
          </Link>
        ) : (
          <button
            key={tab}
            className={`${styles.tab} ${activeCategory === tab ? styles.active : ''}`}
            onClick={() => onCategoryChange(tab)}
            tabIndex={0}
            aria-current={activeCategory === tab ? 'page' : undefined}
          >
            {tab}
          </button>
        )
      )}
    </div>
  );
};

export default CategoryStrip; 