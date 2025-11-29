import { gsap } from 'gsap';

// ==================== TYPES ====================
export type AnimationDirection = 'left' | 'right' | 'up' | 'down';
export type AnimationEase = 'power1' | 'power2' | 'power3' | 'back' | 'elastic' | 'bounce';

export interface AnimationOptions {
  duration?: number;
  delay?: number;
  ease?: string;
  onComplete?: () => void;
  stagger?: number;
}

export interface SlideOptions extends AnimationOptions {
  direction?: AnimationDirection;
  distance?: number;
}

export interface ShakeOptions extends AnimationOptions {
  intensity?: number;
  repeat?: number;
}

// ==================== SLIDE IN ANIMATIONS ====================
export const slideIn = (
  element: HTMLElement | HTMLElement[] | null,
  options: SlideOptions = {}
) => {
  if (!element) return;

  const {
    direction = 'left',
    distance = 100,
    duration = 0.6,
    delay = 0,
    ease = 'power2.out',
    onComplete,
    stagger = 0,
  } = options;

  const fromVars: gsap.TweenVars = {
    opacity: 0,
  };

  switch (direction) {
    case 'left':
      fromVars.x = -distance;
      break;
    case 'right':
      fromVars.x = distance;
      break;
    case 'up':
      fromVars.y = distance;
      break;
    case 'down':
      fromVars.y = -distance;
      break;
  }

  return gsap.from(element, {
    ...fromVars,
    duration,
    delay,
    ease,
    stagger,
    onComplete,
  });
};

// ==================== SLIDE OUT ANIMATIONS ====================
export const slideOut = (
  element: HTMLElement | HTMLElement[] | null,
  options: SlideOptions = {}
) => {
  if (!element) return;

  const {
    direction = 'right',
    distance = 100,
    duration = 0.5,
    delay = 0,
    ease = 'power2.in',
    onComplete,
    stagger = 0,
  } = options;

  const toVars: gsap.TweenVars = {
    opacity: 0,
  };

  switch (direction) {
    case 'left':
      toVars.x = -distance;
      break;
    case 'right':
      toVars.x = distance;
      break;
    case 'up':
      toVars.y = -distance;
      break;
    case 'down':
      toVars.y = distance;
      break;
  }

  return gsap.to(element, {
    ...toVars,
    duration,
    delay,
    ease,
    stagger,
    onComplete,
  });
};

// ==================== SHAKE ANIMATION ====================
export const shake = (
  element: HTMLElement | HTMLElement[] | null,
  options: ShakeOptions = {}
) => {
  if (!element) return;

  const {
    intensity = 10,
    duration = 0.5,
    repeat = 2,
    ease = 'power1.inOut',
    onComplete,
  } = options;

  return gsap.to(element, {
    x: intensity,
    duration: duration / (repeat * 2 + 1),
    repeat,
    yoyo: true,
    ease,
    onComplete,
  });
};

// ==================== RESET ANIMATION ====================
export const resetAnimation = (
  element: HTMLElement | HTMLElement[] | null
) => {
  if (!element) return;
  gsap.killTweensOf(element);
  gsap.set(element, { clearProps: 'all' });
};

// ==================== FORM SWITCH ANIMATION ====================
export interface FormSwitchElements {
  formWrapper: HTMLElement;
  formContent: HTMLElement;
  title?: HTMLElement;
  switchText?: HTMLElement;
}

export interface FormSwitchOptions {
  onSwitch: () => void;
  onComplete?: () => void;
}

export const formSwitchAnimation = (
  elements: FormSwitchElements,
  options: FormSwitchOptions
) => {
  const { formWrapper, formContent, title, switchText } = elements;
  const { onSwitch, onComplete } = options;

  if (!formWrapper || !formContent) return;

  const currentHeight = formContent.offsetHeight;

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.set(formWrapper, {
        height: 'auto',
        clearProps: 'all',
      });
      onComplete?.();
    },
  });

  // Set initial height
  tl.set(formWrapper, {
    height: currentHeight,
  })

  // Slide out current form
  .fromTo(
    formContent,
    {
      opacity: 1,
      x: 0,
    },
    {
      opacity: 0,
      x: -50,
      duration: 0.5,
      ease: 'power2.out',
    }
  )

  // Switch content and shake title
  .call(() => {
    onSwitch();
    if (title) {
      tl.to(title, {
        x: -8,
        duration: 0.05,
        yoyo: true,
        repeat: 3,
        ease: 'power1.inOut',
      }).to(title, {
        x: 0,
        duration: 0.08,
        clearProps: 'x',
      });
    }
  })

  .set({}, {}, '+=0.02')

  // Adjust height for new content
  .call(() => {
    if (formContent && formWrapper) {
      const newHeight = formContent.scrollHeight;
      gsap.to(formWrapper, {
        height: newHeight,
        duration: 0.4,
        ease: 'power1.in',
      });
    }
  })

  // Slide in new form
  .fromTo(
    formContent,
    {
      opacity: 0,
      x: 50,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.4,
      ease: 'back.out(1.5)',
      clearProps: 'all',
    },
    '-=0.2'
  );

  // Animate switch text
  if (switchText) {
    tl.fromTo(
      switchText,
      { opacity: 0.4, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.25,
        ease: 'power1.out',
      },
      '-=0.25'
    );
  }

  return tl;
};