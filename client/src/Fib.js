import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Fib = () => {
    const [seenIndexes, setSeenIndexes] = useState([]);
    const [values, setValues] = useState({});
    const [index, setIndex] = useState('');

    const fetchValues = async () => {
        try {
            const values = await axios.get('/api/values/current');
            setValues(values.data)
        } catch (err) {
            console.log(err.message)
        }
    };
    const fetchIndexes = async () => {
        try {
            const indexesRes = await (axios.get('/api/values/all'))
            setSeenIndexes(indexesRes.data)
        } catch (err) {
            console.log(err.message)
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/api/values', {
                index: index
            });
            fetchIndexes();
            fetchValues();
            setIndex('');
        } catch (err) {
            console.log(err.message)
        }
    }
    useEffect(() => {
        fetchIndexes();
        fetchValues();
    }, []);
    const renderValues = () => {
        const entries = [];
        for (let key in values) {
            entries.push(<div key={key}>
                For index {key}, I calculated {values[key]}
            </div>)
        };

        return entries;
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter your index:</label>
                <input value={index}
                    onChange={(event) => { setIndex(event.target.value) }} />
                <button>Submit</button>
            </form>

            <h3>Indexes I have seen:</h3>
            {seenIndexes.map(({ number }, index) => {
                return number
            }).join(', ')}
            <h3>Calculated Values:</h3>
            {renderValues()}
        </div>
    )
};

export default Fib;