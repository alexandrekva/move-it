import { createContext, useState, ReactNode, useEffect } from 'react';
import challenges from '../../challenges.json';
import Cookies from 'js-cookie';
import LevelupModal from '../components/LevelUpModal';

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengeContextData {
    level: number;
    currentExperience: number;
    completedChallenges: number;
    activeChallenge: Challenge;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    experienceToNextLevel: number;
    completeChallenge: () => void;
    closeLevelUpModal: () => void;
}

interface ChallengesProviderProps {
    children: ReactNode
    level: number;
    currentExperience: number;
    completedChallenges: number;
}

export const ChallengesContext = createContext({} as ChallengeContextData);

export function ChallengesProvider({ children, ...rest}: ChallengesProviderProps) {
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
    const [completedChallenges, setCompletedChallenges] = useState(rest.completedChallenges ?? 0);

    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    useEffect(() => {
        Notification.requestPermission();
    }, [])

    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('completedChallenges', String(completedChallenges));
    }, [level, currentExperience, completedChallenges])

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
    }

    function levelUp() {
        setLevel(level + 1)
        setIsLevelUpModalOpen(true)
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if (Notification.permission === 'granted') {
            new Notification('Novo desafio disnponivel!', {
                body: `Valendo ${challenge.amount} xp`,
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if (!activeChallenge)
            return;

        const { amount } = activeChallenge;

        let finalExperience = currentExperience + amount;

        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setCompletedChallenges(completedChallenges + 1)
    }

    return (
        <ChallengesContext.Provider
            value={{
                level,
                currentExperience,
                completedChallenges,
                activeChallenge,
                levelUp,
                startNewChallenge,
                resetChallenge,
                experienceToNextLevel,
                completeChallenge,
                closeLevelUpModal
            }}
        >
            { children}
            { isLevelUpModalOpen && <LevelupModal />}
        </ChallengesContext.Provider>
    )
}

