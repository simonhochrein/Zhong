# Accurate Timers in JavaScript

Using JavaScript's `setInterval` to increment a timer can be affected by time drift if the window is not focused.
I solved this issue by setting up the interval in a WebWorker  thread instead of the UI thread.
This ensures that it continues to run in the background even if the window is not focused.

In Zhong this is implemented by `src/Lib/worker.ts` and `src/Lib/TimerService.ts`.

I discovered this solution in this great [article](https://hackwild.com/article/web-worker-timers/).