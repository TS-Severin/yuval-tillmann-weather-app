import useLocalStorageState from "use-local-storage-state";
import { uid } from "uid";
import "./App.css";
import Form from "./components/Form";
import Header from "./components/Header";
import List from "./components/List";
import { useState, useEffect } from "react";

// const apiUrl = "https://example-apis.vercel.app/api/weather/europe";

export default function App() {
  const [activities, setActivities] = useLocalStorageState("activities", {
    defaultValue: [],
  });

  const [weather, setWeather] = useState("");

  const [apiUrl, setApiUrl] = useState(
    "https://example-apis.vercel.app/api/weather/europe"
  );

  function handleChangeLocation(location) {
    setApiUrl(`https://example-apis.vercel.app/api/weather/${location}`);
    console.log(apiUrl);
  }

  function handleAddActivity(newActivity) {
    // Check if the activity already exists
    const isActivityExists = activities.some(
      (activity) => activity.name === newActivity.name
    );

    // console.log("Duplicate activity? ", isActivityExists);

    if (isActivityExists) {
      alert("Activity already exists!");
    } else {
      setActivities([...activities, { ...newActivity, id: uid() }]);
    }
  }

  async function getWeather() {
    const response = await fetch(apiUrl);
    const weather = await response.json();

    setWeather(weather);
    console.log("Weather object from API: ", weather);
  }

  const condition = weather.condition;
  const temperature = weather.temperature;
  // console.log("Header: condition: ", condition, "temperature: ", temperature);

  useEffect(() => {
    getWeather();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(getWeather, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const goodWeather = weather.isGoodWeather;

  useEffect(() => {
    if (goodWeather) {
      document.body.classList.add("good-weather");
      document.body.classList.remove("bad-weather");
    } else {
      document.body.classList.add("bad-weather");
      document.body.classList.remove("good-weather");
    }
  }, [goodWeather]);

  const goodWeatherActivities = activities.filter(
    (activity) => activity.isForGoodWeather === true
  );
  // console.log("Good weather activities: ", goodWeatherActivities);

  const badWeatherActivities = activities.filter(
    (activity) => activity.isForGoodWeather === false
  );
  // console.log("BAD weather activities: ", badWeatherActivities);

  // console.log("Is the weather good? ", weather.isGoodWeather);

  function handleDeleteActivity(activityToRemove) {
    setActivities(
      activities.filter((activity) => activity.id !== activityToRemove)
    );
  }

  return (
    <main>
      <Header
        condition={condition}
        temperature={temperature}
        headline={
          goodWeather
            ? "The weather is awesome! Go outside and:"
            : "Bad weather outside! Here's what you can do now:"
        }
        onChangeLocation={handleChangeLocation}
      />
      <List
        activities={goodWeather ? goodWeatherActivities : badWeatherActivities}
        onDeleteActivity={handleDeleteActivity}
      />
      <Form onAddActivity={handleAddActivity} />
    </main>
  );
}
