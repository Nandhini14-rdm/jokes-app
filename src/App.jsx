// // api - application programming interface - connects front and backend
// // mediator - renders data from server to client side


import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [joke, setJoke] = useState([]);
    const [cat, setCat] = useState('Any');

    const [todayCount, setTodayCount] = useState(0);         // stored across refresh
    const [sessionCount, setSessionCount] = useState(0);     // resets on refresh

    useEffect(() => {
        
        const storedDate = localStorage.getItem('jokeDate');
        const storedCount = localStorage.getItem('jokeCount');

        const today = new Date().toLocaleDateString();

        if (storedDate === today) {
            setTodayCount(parseInt(storedCount) || 0);
        } else {
            
            localStorage.setItem('jokeDate', today);
            localStorage.setItem('jokeCount', 0);
            setTodayCount(0);
        }
    }, []);

    function getCat(event) {
        setCat(event.target.value);
    }

    async function getJoke() {
        const response = await fetch(`https://v2.jokeapi.dev/joke/${cat}`);
        const jokeObj = await response.json();
        if (jokeObj.type === 'twopart') {
            setJoke([jokeObj.setup, jokeObj.delivery]);
        } else {
            setJoke([jokeObj.joke]);
        }

        
        setSessionCount(c => c + 1);

        setTodayCount(prev => {
            const newCount = prev + 1;
            localStorage.setItem('jokeCount', newCount);
            return newCount;
        });
    }

    return (
        <div>
            <h2 className="heading">🎉 Daily Dose of Laughter 😄</h2>
            <button onClick={getJoke}>Get Joke</button>
            <select onChange={getCat}>
                <option value="Any">Any</option>
                <option value="Programming">Programming</option>
                <option value="Dark">Dark</option>
                <option value="Pun">Pun</option>
                <option value="Spooky">Spooky</option>
                <option value="Christmas">Christmas</option>
                <option value="Misc">Misc</option>
            </select>
            <div>
                {
                    joke.length > 1 ? (
                        <div>
                            <h1>{joke[0]}</h1>
                            <h1>{joke[1]}</h1>
                        </div>
                    ) : (
                        <h1>{joke[0]}</h1>
                    )
                }
            </div>
            <p><strong>Today’s Joke Count:</strong> {todayCount}</p>
            <p><strong>This Session’s Joke Count:</strong> {sessionCount}</p>
        </div>
    );
}

export default App;
