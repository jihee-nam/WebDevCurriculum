// TODO: cjs-package와 esm-package의 함수와 클래스들을 가져다 쓰고 활용하려면 어떻게 해야 할까요?
//esm-package 함수, 클래스 가져다 쓰기
//상위 디렉토리로 이동해서 상대경로(현재 모듈의 위치를 기준) 사용
import { EsmUtilClass, esmUtilFunction} from '../esm-package/index.mjs';
const unit1 = new EsmUtilClass('30');
const unit2 = new EsmUtilClass('Lucky in my life');
console.log(unit1.double());
console.log(esmUtilFunction('lucky in my life'));

//cjs-package 함수, 클래스 가져다 쓰기
import { CjsUtilClass, cjsUtilFunction } from '../cjs-package/index.js';
const cjsUnit1 = new CjsUtilClass('10');
const cjsUnitFunc = cjsUtilFunction('Chicken time!!');
console.log(cjsUnit1.double());
console.log(cjsUnitFunc);
