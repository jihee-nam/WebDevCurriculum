// TODO: cjs-package와 esm-package의 함수와 클래스들을 가져다 쓰고 활용하려면 어떻게 해야 할까요?
//cjs-package 함수와 클래스 가져다 쓰기
const { CjsUtilClass, cjsUtilFunction } = require('../cjs-package/index.js');
const cjsUnit1 = new CjsUtilClass('10');
const cjsUnit1Func = cjsUtilFunction('hello');
console.log(cjsUnit1.double());
console.log(cjsUnit1Func);

//esm-package 함수와 클래스 가져다 쓰기
//CJS에서는 require함수를 동기적으로 사용할 수 있지만, EMS 에서는 항상 Promise를 반환하므로 awiat나 .then()을 사용해야 한다.
async function loadEmsModuls() {
    esmModules = await import('../esm-package/index.mjs');
    const EsmUtilClass = esmModules.EsmUtilClass;
    const esmUtilFunc = esmModules.esmUtilFunction;
    const esmUnit1 = new EsmUtilClass('20');
    const esmFunc1 = esmUtilFunc('party time!');
    console.log(esmUnit1.double());
    console.log(esmFunc1);
};
loadEmsModuls();

//EMS모듈을 비동기적으로 불러오기 위해 작성해 봄
/*
import('../esm-package/index.mjs').then( module => {
    const EsmUtilClass = module.EsmUtilClass;
    const esmUtilFunc = module.esmUtilFunction;
    const esmUnit1 = new EsmUtilClass('20');
    const esmFunc1 = esmUtilFunc('party time!');
    console.log(esmUnit1.double());
    console.log(esmFunc1);
})
*/