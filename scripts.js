window.addEventListener("DOMContentLoaded", () => {

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

  function alarm() {
    let audio = document.getElementById('audio')
    let countdown = document.getElementById('countdown');
    let button = document.createElement('button')
    button.innerText = "Stop"
    button.addEventListener("click", () => {
      audio.pause()
    })
    countdown.appendChild(button)
    audio.volume = .2;
    audio.play()
  }

  function updateTimer(timer) {
    setTimeout(()=>{
    const now = new Date()
    const timeLeft = endtime - now
    if (timeLeft > 0) {
      const newTime = msToTime(timeLeft)
      timer.innerText = newTime;
      updateTimer(timer)
      } else {
        alarm()
      }

    }, 300)
  }

  updateTimer(timer)

})
