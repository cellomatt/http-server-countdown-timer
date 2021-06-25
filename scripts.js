window.addEventListener("DOMContentLoaded", () => {
  console.log("loaded")

  const timer = document.getElementById("timer")
  const timeLeft = timer.innerText.split(":")
  let endtime = new Date()
  let currentHours = endtime.getHours()
  let currentMinutes = endtime.getMinutes()
  let currentSeconds = endtime.getSeconds()

  currentHours += Number(timeLeft[0])
  currentMinutes += Number(timeLeft[1])
  currentSeconds += Number(timeLeft[2])
  if (currentSeconds > 59) {
    currentMinutes += 1
    currentSeconds -= 60
  }
  if (currentMinutes > 59) {
    currentHours += 1
    currentMinutes -= 60
  }
  endtime.setHours(currentHours, currentMinutes, currentSeconds)

  function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  }

  function updateTimer(timer) {
    const now = new Date()
    const timeLeft = endtime - now
    if (timeLeft >= 0) {
      const newTime = msToTime(timeLeft)
      timer.innerText = newTime;
      console.log("updating!", newTime)
      setTimeout(()=>{
        updateTimer(timer)
      }, 300)

    }
  }
  updateTimer(timer)

})
