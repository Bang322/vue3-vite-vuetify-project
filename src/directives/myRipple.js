export default {
    mounted(el, binding) {
        const value = binding.value;
        const elPosition =
            el.style.position || window.getComputedStyle(el).position;
        let rippleContainer = null;

        if (elPosition !== 'absolute') {
            el.style.position = 'relative';
            el.style.overflow = 'hidden';
        }
        // 해당 element 의 position 이 absolute 일 경우, rippleContainer 생성
        // position 값이 absolute 인 요소를 relative 로 변경하면 문제가 생길 수 있으므로 따로 설정해줘야 함
        else {
            rippleContainer = document.createElement('div');
            rippleContainer.className = 'ripple-container';
            rippleContainer.style.position = 'relative';
            rippleContainer.style.overflow = 'hidden';
            rippleContainer.style.width = '100%';
            rippleContainer.style.height = '100%';
            rippleContainer.style.borderRadius = 'inherit';
        }

        el.addEventListener('mousedown', e => {
            const ripple = document.createElement('span');
            const rect = el.getBoundingClientRect();

            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.backgroundColor =
                value?.color || 'rgba(255, 255, 255, 0.28)';
            ripple.style.width = '2px';
            ripple.style.height = '2px';

            // 끝났을 때
            ripple.animate(
                [
                    {
                        transform: 'translate(-50%, -50%) scale(1)'
                    },
                    {
                        transform:
                            'translate(-50%, -50%) scale(var(--ripple-scale))',
                        opacity: 0
                    }
                ],
                {
                    duration: value?.duration || 500,
                    easing: value?.easing || 'ease-out'
                }
            ).onfinish = e => {
                // 애니메이션이 끝났을 때 -> 추가해줬던 element 들 제거
                ripple.remove();

                if (
                    elPosition === 'absolute' &&
                    !rippleContainer.children.length
                ) {
                    rippleContainer.remove();
                }
            };
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            ripple.style.setProperty('--ripple-scale', el.offsetWidth);

            // 해당 element 의 position 이 absolute 일 경우에는 rippleContainer 추가해줌
            if (elPosition === 'absolute') {
                // appendChild 는 해당 위치에 추가하기 전에 기존 위치에서 노드를 제거하기 때문에 중복돼서 append 되지 않음
                // rippleContainer 는 오직 하나만 존재
                el.appendChild(rippleContainer);
                rippleContainer.appendChild(ripple);
            } else {
                el.appendChild(ripple);
            }

            /*
            setTimeout(() => {
                if (elPosition === 'absolute') {
                    rippleContainer.remove();
                    ripple.remove();
                } else ripple.remove();
            }, value?.duration || 500);
*/
        });
    }
};
