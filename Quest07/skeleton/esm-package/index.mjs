export class EsmUtilClass {
    //#foo 왠만하면 private 변수를 사용하는게 안전하다
    constructor(foo) {
        this.foo = foo;
    }
//만약
    minus(x) {
        return this.foo - x;
    }
    double() {
        //return foo * 2;
        return this.foo * 2;
    }
}

export const esmUtilFunction = str => {
    return str.toUpperCase();
};

//팩토리 함수로 정의할 수 있다.
function  createCjsUnit (foo/*자동적으로 private 변수가 된다.*/) {
    let xx= 10;//이것또한 자동적으로 private 변수가 된다.
    return {
        publicVar: 10;//이렇게 public 변수를 만들 수 있다.
        minus(x) {
            return this.foo - x;
        },
        double() {
            return foo*2;
        },
        plusTen() {
            foo += xx;
        }
    }
}
const cu = createCjsUnit(5);
cu.double();//이렇게 동일한 값을 얻을 수 있다.
cu.minus(3);//이렇게 선언해서 사용하면 클래스랑 결과가 같게 만들 수 있다.
cu.publicVar = 1234;
// TODO: 다른 패키지가 EsmUtilClass와 esmUtilFunction를 가져다 쓰려면 어떻게 해야 할까요?
