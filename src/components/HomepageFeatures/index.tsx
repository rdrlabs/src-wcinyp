import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'MRI Manual',
    emoji: '📘',
    description: (
      <>
        Comprehensive MRI protocols, procedures, and best practices for 
        Weill Cornell Imaging at NewYork-Presbyterian medical professionals.
      </>
    ),
  },
  {
    title: 'Contact Directory',
    emoji: '📞',
    description: (
      <>
        Quick access to essential contacts for radiology departments, 
        technologists, and support staff across WCINYP facilities.
      </>
    ),
  },
  {
    title: 'Emergency Procedures',
    emoji: '🚨',
    description: (
      <>
        Critical emergency protocols and safety procedures for urgent 
        situations in medical imaging environments.
      </>
    ),
  },
];

function Feature({title, emoji, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureSvg} role="img" style={{fontSize: '4rem'}}>
          {emoji}
        </div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}