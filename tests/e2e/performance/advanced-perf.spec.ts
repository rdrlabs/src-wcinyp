import { test, expect } from '@playwright/test';
import { waitForPageLoad, measureInteractionPerformance } from './utils/performance-helpers';

interface LongTask {
  name: string;
  duration: number;
  startTime: number;
  attribution: string[];
}

interface JSExecutionMetrics {
  mainThreadBlockingTime: number;
  longTasks: LongTask[];
  scriptParseTime: number;
  scriptCompileTime: number;
  scriptExecutionTime: number;
  totalJSTime: number;
  functionCallCount: Record<string, number>;
}

test.describe('Advanced JavaScript Performance Metrics', () => {
  test('should measure main thread blocking time', async ({ page }) => {
    await page.goto('/');
    
    // Inject long task observer
    const longTasks = await page.evaluate(() => {
      return new Promise<LongTask[]>((resolve) => {
        const tasks: LongTask[] = [];
        
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const task = entry as any;
            tasks.push({
              name: task.name,
              duration: task.duration,
              startTime: task.startTime,
              attribution: task.attribution?.map((attr: any) => attr.name) || [],
            });
          }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
        
        // Wait for page to stabilize
        setTimeout(() => {
          observer.disconnect();
          resolve(tasks);
        }, 5000);
      });
    });
    
    // Calculate total blocking time (TBT)
    const totalBlockingTime = longTasks.reduce((total, task) => {
      // Only count time over 50ms as blocking
      const blockingTime = Math.max(0, task.duration - 50);
      return total + blockingTime;
    }, 0);
    
    console.log('Main thread blocking analysis:');
    console.log(`Total blocking time: ${totalBlockingTime.toFixed(0)}ms`);
    console.log(`Number of long tasks: ${longTasks.length}`);
    
    if (longTasks.length > 0) {
      console.log('\nLong tasks breakdown:');
      longTasks.slice(0, 5).forEach(task => {
        console.log(`- ${task.duration.toFixed(0)}ms at ${task.startTime.toFixed(0)}ms`);
        if (task.attribution.length > 0) {
          console.log(`  Attribution: ${task.attribution.join(', ')}`);
        }
      });
    }
    
    // TBT should be under 300ms for good interactivity
    expect(totalBlockingTime).toBeLessThan(300);
  });

  test('should analyze script parsing and compilation', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      test.skip();
    }
    
    // Enable DevTools Protocol
    const client = await page.context().newCDPSession(page);
    await client.send('Runtime.enable');
    await client.send('Profiler.enable');
    
    const scriptMetrics: Record<string, any> = {};
    
    // Track script parsing
    client.on('Runtime.scriptParsed', (params) => {
      scriptMetrics[params.scriptId] = {
        url: params.url,
        length: params.length,
        startLine: params.startLine,
        endLine: params.endLine,
        parseTime: 0,
        compileTime: 0,
        executionTime: 0,
      };
    });
    
    // Start profiling
    await client.send('Profiler.start');
    
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Stop profiling and get data
    const profileData = await client.send('Profiler.stop');
    
    // Analyze profile data
    if (profileData.profile) {
      const nodes = profileData.profile.nodes || [];
      const samples = profileData.profile.samples || [];
      const timeDeltas = profileData.profile.timeDeltas || [];
      
      // Calculate time spent in different phases
      let parseTime = 0;
      let compileTime = 0;
      let executionTime = 0;
      
      nodes.forEach((node: any) => {
        const functionName = node.callFrame.functionName;
        if (functionName.includes('parse') || functionName.includes('Parse')) {
          parseTime += node.hitCount || 0;
        } else if (functionName.includes('compile') || functionName.includes('Compile')) {
          compileTime += node.hitCount || 0;
        } else {
          executionTime += node.hitCount || 0;
        }
      });
      
      const totalSamples = samples.length;
      const sampleInterval = timeDeltas.reduce((a: number, b: number) => a + b, 0) / totalSamples;
      
      console.log('Script execution metrics:');
      console.log(`- Parse time: ~${(parseTime * sampleInterval / 1000).toFixed(0)}ms`);
      console.log(`- Compile time: ~${(compileTime * sampleInterval / 1000).toFixed(0)}ms`);
      console.log(`- Execution time: ~${(executionTime * sampleInterval / 1000).toFixed(0)}ms`);
      console.log(`- Total samples: ${totalSamples}`);
    }
    
    // Get V8 compile cache statistics
    const v8Stats = await page.evaluate(() => {
      if ('v8' in window && typeof (window as any).v8.getHeapStatistics === 'function') {
        return (window as any).v8.getHeapStatistics();
      }
      return null;
    });
    
    if (v8Stats) {
      console.log('\nV8 heap statistics:');
      console.log(`- Used heap size: ${(v8Stats.used_heap_size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`- Total heap size: ${(v8Stats.total_heap_size / 1024 / 1024).toFixed(2)} MB`);
    }
  });

  test('should track function execution performance', async ({ page }) => {
    // Inject performance tracking
    await page.addInitScript(() => {
      const functionTimings: Record<string, { count: number; totalTime: number }> = {};
      const originalSetTimeout = window.setTimeout;
      const originalRequestAnimationFrame = window.requestAnimationFrame;
      
      // Track setTimeout usage
      (window as any).setTimeout = function(...args: any[]) {
        const start = performance.now();
        const result = originalSetTimeout.apply(window, args as any);
        const duration = performance.now() - start;
        
        functionTimings['setTimeout'] = functionTimings['setTimeout'] || { count: 0, totalTime: 0 };
        functionTimings['setTimeout'].count++;
        functionTimings['setTimeout'].totalTime += duration;
        
        return result;
      };
      
      // Track requestAnimationFrame usage
      (window as any).requestAnimationFrame = function(callback: FrameRequestCallback) {
        const start = performance.now();
        
        return originalRequestAnimationFrame((time) => {
          const duration = performance.now() - start;
          functionTimings['requestAnimationFrame'] = functionTimings['requestAnimationFrame'] || { count: 0, totalTime: 0 };
          functionTimings['requestAnimationFrame'].count++;
          functionTimings['requestAnimationFrame'].totalTime += duration;
          
          callback(time);
        });
      };
      
      // Expose timings
      (window as any).__functionTimings = functionTimings;
    });
    
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Trigger some interactions
    await page.keyboard.press('Meta+K');
    await page.waitForTimeout(500);
    await page.keyboard.press('Escape');
    
    // Get function timings
    const timings = await page.evaluate(() => (window as any).__functionTimings);
    
    console.log('Function execution statistics:');
    Object.entries(timings).forEach(([func, stats]: [string, any]) => {
      console.log(`- ${func}: ${stats.count} calls, ${stats.totalTime.toFixed(2)}ms total`);
    });
    
    // Measure specific user interactions
    const searchOpenTime = await measureInteractionPerformance(page, async () => {
      await page.keyboard.press('Meta+K');
      await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    });
    
    console.log(`\nSearch dialog open: ${searchOpenTime}ms`);
    
    // Close search
    await page.keyboard.press('Escape');
  });

  test('should analyze event listener performance', async ({ page }) => {
    // Inject event listener tracking
    await page.addInitScript(() => {
      const eventTimings: Record<string, { count: number; totalTime: number; maxTime: number }> = {};
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      
      EventTarget.prototype.addEventListener = function(type: string, listener: any, options?: any) {
        const wrappedListener = function(this: any, event: Event) {
          const start = performance.now();
          
          try {
            if (typeof listener === 'function') {
              listener.call(this, event);
            } else if (listener && typeof listener.handleEvent === 'function') {
              listener.handleEvent(event);
            }
          } finally {
            const duration = performance.now() - start;
            
            if (!eventTimings[type]) {
              eventTimings[type] = { count: 0, totalTime: 0, maxTime: 0 };
            }
            
            eventTimings[type].count++;
            eventTimings[type].totalTime += duration;
            eventTimings[type].maxTime = Math.max(eventTimings[type].maxTime, duration);
          }
        };
        
        return originalAddEventListener.call(this, type, wrappedListener, options);
      };
      
      (window as any).__eventTimings = eventTimings;
    });
    
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Trigger various events
    await page.hover('a[href="/documents"]');
    await page.click('a[href="/documents"]');
    await page.waitForLoadState('networkidle');
    
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Scroll to trigger scroll events
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
      window.scrollTo(0, 0);
    });
    
    // Get event timings
    const eventTimings = await page.evaluate(() => (window as any).__eventTimings);
    
    console.log('Event listener performance:');
    Object.entries(eventTimings)
      .sort((a: any, b: any) => b[1].totalTime - a[1].totalTime)
      .slice(0, 10)
      .forEach(([event, stats]: [string, any]) => {
        console.log(`- ${event}: ${stats.count} calls, ${stats.totalTime.toFixed(2)}ms total, ${stats.maxTime.toFixed(2)}ms max`);
      });
    
    // Check for slow event handlers
    const slowEvents = Object.entries(eventTimings)
      .filter(([_, stats]: [string, any]) => stats.maxTime > 50);
    
    if (slowEvents.length > 0) {
      console.log('\nSlow event handlers (>50ms):');
      slowEvents.forEach(([event, stats]: [string, any]) => {
        console.log(`- ${event}: ${stats.maxTime.toFixed(2)}ms max time`);
      });
    }
    
    expect(slowEvents.length).toBeLessThan(3);
  });

  test('should measure React component render performance', async ({ page }) => {
    // Check if React DevTools is available
    const hasReact = await page.evaluate(() => {
      return !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
    });
    
    if (!hasReact) {
      console.log('React DevTools not detected, skipping React-specific metrics');
      test.skip();
    }
    
    // Enable React profiling
    await page.addInitScript(() => {
      if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
        
        // Track render phases
        const renderMetrics = {
          commitCount: 0,
          totalCommitTime: 0,
          componentRenders: {} as Record<string, number>,
        };
        
        const originalCommitFiberRoot = hook.onCommitFiberRoot;
        hook.onCommitFiberRoot = function(id: any, root: any, priorityLevel: any) {
          renderMetrics.commitCount++;
          
          // Call original
          if (originalCommitFiberRoot) {
            originalCommitFiberRoot.call(hook, id, root, priorityLevel);
          }
        };
        
        (window as any).__reactRenderMetrics = renderMetrics;
      }
    });
    
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Trigger some React re-renders
    await page.click('a[href="/documents"]');
    await page.waitForLoadState('networkidle');
    
    const metrics = await page.evaluate(() => (window as any).__reactRenderMetrics);
    
    if (metrics) {
      console.log('React render metrics:');
      console.log(`- Commit count: ${metrics.commitCount}`);
      console.log(`- Total commit time: ${metrics.totalCommitTime}ms`);
      
      if (Object.keys(metrics.componentRenders).length > 0) {
        console.log('\nComponent render counts:');
        Object.entries(metrics.componentRenders)
          .sort((a: any, b: any) => b[1] - a[1])
          .slice(0, 10)
          .forEach(([component, count]) => {
            console.log(`- ${component}: ${count} renders`);
          });
      }
    }
  });

  test('should analyze animation performance', async ({ page }) => {
    // Monitor animation frames
    const animationMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const frames: number[] = [];
        let lastTime = performance.now();
        let frameCount = 0;
        const maxFrames = 300; // ~5 seconds at 60fps
        
        function measureFrame() {
          const currentTime = performance.now();
          const delta = currentTime - lastTime;
          frames.push(delta);
          lastTime = currentTime;
          frameCount++;
          
          if (frameCount < maxFrames) {
            requestAnimationFrame(measureFrame);
          } else {
            // Calculate metrics
            const avgFrameTime = frames.reduce((a, b) => a + b, 0) / frames.length;
            const fps = 1000 / avgFrameTime;
            const droppedFrames = frames.filter(f => f > 16.67).length;
            const jank = frames.filter(f => f > 33.33).length;
            
            resolve({
              avgFrameTime,
              fps,
              droppedFrames,
              jank,
              frameCount,
              worstFrame: Math.max(...frames),
            });
          }
        }
        
        requestAnimationFrame(measureFrame);
        
        // Trigger some animations
        setTimeout(() => {
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }, 100);
        
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000);
      });
    });
    
    console.log('Animation performance metrics:');
    console.log(`- Average FPS: ${animationMetrics.fps.toFixed(1)}`);
    console.log(`- Dropped frames (>16.67ms): ${animationMetrics.droppedFrames} (${(animationMetrics.droppedFrames / animationMetrics.frameCount * 100).toFixed(1)}%)`);
    console.log(`- Janky frames (>33.33ms): ${animationMetrics.jank}`);
    console.log(`- Worst frame: ${animationMetrics.worstFrame.toFixed(1)}ms`);
    
    // Should maintain 60fps most of the time
    expect(animationMetrics.fps).toBeGreaterThan(50);
    expect(animationMetrics.jank).toBeLessThan(animationMetrics.frameCount * 0.05); // Less than 5% jank
  });
});