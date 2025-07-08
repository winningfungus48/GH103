import { useState } from 'react';
import styles from './CategoryStrip.module.css';

const CategoryStrip = () => {
  const tabs = ['A-Z Games', 'Favorites', '-le Games', 'Sports', 'See More'];
  const [activeTab, setActiveTab] = useState('A-Z Games');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.categoryStrip}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
          onClick={() => handleTabClick(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default CategoryStrip; 