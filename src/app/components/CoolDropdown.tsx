import { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import useSound from "use-sound";
import { DoubleChevronFlipIcon } from "./DoubleChevronFlipIcon";

interface CoolDropdownProps {
  location: string | null;
  setLocation: (location: string) => void;
  selectedLocationName: string | undefined;
  laracons: { id: string, name: string }[];
}

export default function CoolDropdown({ location, setLocation, selectedLocationName, laracons }: CoolDropdownProps) {
  const [open, setOpen] = useState(false);
  const [hasShownCheck, setHasShownCheck] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Add sound effects
  const clickSoundUrl = "/audio/woosh.mp3";
  const [playClick] = useSound(clickSoundUrl, { volume: 0.075 });

  const hoverSoundUrl = "/audio/click.mp3";
  const [playHover, { stop }] = useSound(hoverSoundUrl, { volume: 0.1 });

  // Only animate trigger checkmark once when it is first revealed
  useEffect(() => {
    if (location && !hasShownCheck) {
      setHasShownCheck(true);
    }
  }, [location, hasShownCheck]);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button 
          type="button"
          className="w-80 sm:w-96 h-14 flex items-center justify-center focus:outline-none rounded-2xl shadow-heavy group"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls="laracon-menu"
          aria-label={selectedLocationName ? `Laracon: ${selectedLocationName}` : 'Select a Laracon'}
          onPointerDown={() => playClick()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              playClick();
            }
          }}
        >
          <motion.div 
            whileTap={{ scale: 0.975, transition: { duration: 0.1 } }}
            initial={false}
            animate={{ paddingLeft: location ? '1rem' : '1.5rem' }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className={`
              noise
              w-full h-14 flex items-center justify-center bg-gradient-to-r from-neutral-900 to-neutral-800 border border-neutral-700 cursor-pointer rounded-2xl px-6 py-4 group-focus:ring-transparent transition-colors ease-in-out
              <!-- Hover -->
              hover:border-neutral-650 hover:from-neutral-850 hover:to-neutral-700
              <!-- Focus -->
              group-focus-visible:ring group-focus-visible:ring-neutral-600
              <!-- Selected -->
              ${location ? 'pl-4' : 'pl-12'}
            `}
            tabIndex={-1}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3 text-sm sm:text-base">
                {location && (
                  <Check className="size-4 text-accent" animateOnMount={!hasShownCheck} />
                )}
                <div className="flex flex-col items-start">
                  <AnimatePresence>
                    {location && (
                      <motion.div
                        layoutId={prefersReducedMotion ? undefined : "laracon-label"}
                        className="text-xs text-neutral-400 mb-0"
                        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
                      >
                        Laracon
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="text-white font-semibold tracking-tight">
                    {selectedLocationName && (
                      <motion.span
                        key={selectedLocationName}
                        className="text-white font-semibold tracking-tight"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ 
                          duration: 0.75, 
                          ease: [0.32, 0.72, 0, 1],
                          delay: hasShownCheck || prefersReducedMotion ? 0 : 0.3,
                        }}
                      >
                        {selectedLocationName}
                      </motion.span>
                    )}
                    {!selectedLocationName && (
                      <>
                        Select a{' '}
                      </>
                    )}
                    <AnimatePresence>
                      {!selectedLocationName && (
                        <motion.span
                          layoutId={prefersReducedMotion ? undefined : "laracon-label"}
                          className="inline-block"
                          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                        >
                          Laracon
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <DoubleChevronFlipIcon open={open} size={12} />
            </div>
          </motion.div>
        </button>
      </DropdownMenu.Trigger>

      {/* Live region for selection announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {selectedLocationName ? `Selected ${selectedLocationName}` : 'No location selected'}
      </div>

      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          id="laracon-menu"
          sideOffset={8}
          align="end"
          className="w-80 sm:w-96"
        >
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.15 }}
          >
            <DropdownMenu.RadioGroup value={location ?? ''} onValueChange={(val) => setLocation(val)}>
              {laracons.map((laracon, index) => (
                <motion.div
                  key={laracon.id}
                  initial={prefersReducedMotion ? false : { 
                    opacity: 0, 
                    y: -10, 
                    scale: 0.9,
                    x: -index * 10,
                    rotate: (index + 1) * 0.25,
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    x: index * 1,
                    rotate: (index + 1) * -1,
                  }}
                  transition={prefersReducedMotion ? { duration: 0 } : {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    delay: index * 0.05,
                  }}
                  style={{
                    transformOrigin: 'top right',
                    marginBottom: 8,
                    marginLeft: `${index * 1}px`,
                  }}
                >
                  <DropdownMenu.RadioItem
                    value={laracon.id}
                    className={`
                      noise
                      w-full max-w-96 h-14 flex items-center bg-gradient-to-r from-neutral-900 to-neutral-800 border border-neutral-700  rounded-2xl py-4 outline-none transition-all duration-200 cursor-pointer
                      <!-- Hover -->
                      hover:border-neutral-650 hover:from-neutral-850 hover:to-neutral-700
                      <!-- Focus -->
                      data-[highlighted]:focus-visible:from-neutral-850 data-[highlighted]:focus-visible:to-neutral-700 data-[highlighted]:focus-visible:border-neutral-650
                      <!-- Selected -->
                      ${location === laracon.id ? 'px-4' : 'px-12'}
                    `}
                    onFocus={() => {
                      playHover();
                    }}
                    onBlur={() => {
                      stop();
                    }}
                    onMouseEnter={() => {
                      playHover();
                    }}
                    onMouseLeave={() => {
                      stop();
                    }}
                  >
                      <div className="flex items-center gap-3 font-semibold text-sm sm:text-base">
                        {location === laracon.id && (
                          <DropdownMenu.ItemIndicator forceMount>
                            <Check className="size-4 text-accent" animateOnMount={!hasShownCheck} />
                          </DropdownMenu.ItemIndicator>
                        )}  
                        <span>{laracon.name}</span>
                      </div>
                  </DropdownMenu.RadioItem>
                </motion.div>
              ))}
            </DropdownMenu.RadioGroup>
          </motion.div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

function Check({ className, animateOnMount = false }: { className?: string, animateOnMount?: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true" focusable="false">
      <motion.path
        d="M0.630837 7.59577L3.68274 10.543L11.5244 1.4047"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ 
          pathLength: animateOnMount && !prefersReducedMotion ? 0 : 1,
          opacity: animateOnMount && !prefersReducedMotion ? 0.25 : 1,
        }}
        animate={animateOnMount && !prefersReducedMotion ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{
          type: "tween", 
          duration: 1.1, 
          ease: [0.32, 0.72, 0, 1]
        }}
      />
    </motion.svg>
  )
}