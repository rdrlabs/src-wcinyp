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
    title: 'Provider Database',
    emoji: '👥',
    description: (
      <>
        Comprehensive provider directory with contact information, 
        NPI numbers, and important clinical notes.
      </>
    ),
  },
  {
    title: 'Document Hub',
    emoji: '📄',
    description: (
      <>
        Medical forms and questionnaires organized by modality 
        with bulk printing capabilities.
      </>
    ),
  },
  {
    title: 'Form Generator',
    emoji: '📝',
    description: (
      <>
        Generate and customize self-pay agreement forms 
        with real-time preview and printing.
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