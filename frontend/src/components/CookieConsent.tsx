// src/components/CookieConsent.tsx
import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
    } from 'react';
    
    interface CookieConsentContextType {
        cookieConsent: string | null;
        setCookieConsent: (value: string) => void;
    }
    
    const CookieConsentContext = createContext<CookieConsentContextType>({
        cookieConsent: null,
        setCookieConsent: () => {},
    });
    
    export const useCookieConsent = () => useContext(CookieConsentContext);
    
    interface ProviderProps {
        children: ReactNode;
    }
    
    export const CookieConsentProvider = ({ children }: ProviderProps) => {
        const [cookieConsent, setCookieConsentState] = useState<string | null>(null);
    
        useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        setCookieConsentState(consent);
        }, []);
    
        const setCookieConsent = (value: string) => {
        localStorage.setItem('cookieConsent', value);
        setCookieConsentState(value);
        };
    
        return (
        <CookieConsentContext.Provider value={{ cookieConsent, setCookieConsent }}>
            {children}
        </CookieConsentContext.Provider>
        );
    };
    
    const CookieConsent = () => {
        const { cookieConsent, setCookieConsent } = useCookieConsent();
    
        // If a decision was already made, don't show the banner.
        if (cookieConsent !== null) {
        return null;
        }
    
        const handleAccept = () => {
        setCookieConsent('true');
        };
    
        const handleDecline = () => {
        setCookieConsent('false');
        };
    
        // Inline styles
        const styles: { [key: string]: React.CSSProperties } = {
        banner: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#323232',
            color: '#fff',
            padding: '10px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
            fontSize: '14px',
        },
        message: {
            flex: 1,
        },
        link: {
            color: '#fff',
            textDecoration: 'underline',
        },
        buttonAccept: {
            marginLeft: '20px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 12px',
            cursor: 'pointer',
        },
        buttonDecline: {
            marginLeft: '20px',
            backgroundColor: '#f44336',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 12px',
            cursor: 'pointer',
        },
        };
    
        return (
        <div style={styles.banner}>
            <div style={styles.message}>
            We use cookies to improve your experience. By using our site, you agree
            to our{' '}
            <a href="/privacy-policy" style={styles.link}>
                Privacy Policy
            </a>
            .
            </div>
            <button onClick={handleAccept} style={styles.buttonAccept}>
            Accept
            </button>
            <button onClick={handleDecline} style={styles.buttonDecline}>
            Decline
            </button>
        </div>
        );
    };
    
    export default CookieConsent;
  