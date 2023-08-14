import { useState } from 'react';
import './App.css';
import axios from 'axios';

//grab id information

//show that animals image


function App() {
    const [id, setID] = useState('');
    const [user, setUser] = useState(null);

    function UserProf() {

        const changePic = async (changeID) => {
            let newURL = prompt('What pic would you like to use?');

            let res = await axios.put(`http://localhost:8000/animals/${changeID}`,{picture: newURL});

            setUser(prev => {
                let animals = prev.animals.map(a => {
                    if (a.id !== changeID) return a;
                    a.picture = newURL;
                    return a;
                })

                return {...prev, animals: animals}
            })
        }

        const showAnimals = user.animals?.map(a => {
            return (
                <div key={a.id}>
                    <h2 key={a.id}>{a.name}</h2>
                    <img src={a.picture} onClick={() => changePic(a.id)} />
                </div>
            )
        })

        return (
            <>
                {user.name} is logged in!
                {showAnimals}
            </>
        )
    }
    
    const grabPerson = async () => {
        let res = await axios.post('http://localhost:8000/players', {id});
        if (!res.data) {
            alert('User does not exist');
        } else {
            console.log(res.data);
            setUser(res.data);
        }
    }

    return (
        <div className="App-header">
            Find the animals

            <input type="text" onChange={(e) => {setID(e.target.value)}}/>
            <button onClick={grabPerson}>Find person</button>
            <br/>

            { user ? <UserProf/> : null }
        </div>
    );
}

export default App;


