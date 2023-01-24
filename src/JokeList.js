import React, { useState, Component } from "react";
import axios from "axios";
import Joke from "./Joke";
import useAPICall from "./hooks/useAPICall";
import useToggleState from "./hooks/useToggle";
import "./JokeList.css";

/** List of jokes. */

const JokeList = () => {

  const numJokesToGet = 5

  const [isLoading, toggleIsLoading] = useToggleState()
  const [jokes, setJokes] = useState([])
  // const [joke, fetchJokes] = useAPICall() 

  /* at mount, get jokes */
  /*UseEffect */
  // componentDidMount() {
  //   this.getJokes();
  // }

  /* retrieve jokes from API */

  async function getJokes() {

    try {
      // load jokes one at a time, adding not-yet-seen jokes
      let newJokes=[]
      let seenJokes = new Set();

      while (newJokes.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          newJokes.push({ ...joke, votes: 0 });
        } else {
          console.log("duplicate found!");
        }
      }

      setJokes(newJokes)
    } catch (err) {
      console.error(err);
    }
  }

  /* empty joke list, set to loading state, and then call getJokes */

  const generateNewJokes = () => {
    getJokes();
    toggleIsLoading()
  }

  /* change vote for this id by delta (+1 or -1) */

  const vote = (id, delta) => {
    setJokes(jokes.map(j =>
      j.id === id ? { ...j, votes: j.votes + delta } : j
    )
    )
  };


  /* render: either loading spinner or list of sorted jokes. */


  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
  if (isLoading) {
    generateNewJokes()
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    )
  }


  return (
    <div className="JokeList">
      <button
        className="JokeList-getmore"
        onClick={generateNewJokes}
      >
        Get New Jokes
      </button>

      {sortedJokes.map(j => (
        <Joke
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={vote}
        />
      ))}
    </div>
  );
}


export default JokeList;
