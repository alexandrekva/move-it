import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Profile.module.css'

export default function Profile() {
    const { level } = useContext(ChallengesContext);
    return(
        <div className={styles.profileContainer}>
            <img 
            src="https://pbs.twimg.com/profile_images/1296895973197860869/4ZXzdRX0_normal.jpg"
            alt="Eu" 
            />
            <div>
                <strong>Eu</strong>
                <p>
                    <img src="icons/level.svg" alt="Level"/>
                    Level { level }</p>
            </div>
        </div>
    );
}