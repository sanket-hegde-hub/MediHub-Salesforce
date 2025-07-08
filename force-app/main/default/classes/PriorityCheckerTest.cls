
@isTest
private class PriorityCheckerTest {

    @isTest
    static void checkPriorityTest() {
        String pr = PriorityChecker.checkPriority('NY');
        System.assertEquals('High', pr);
    }

    @IsTest
    static void checkPriorityTest2() {
        String pr = PriorityChecker.checkPriority('CA');
        System.AssertEquals('Low', pr);
    }

    @IsTest
    static void checkPriorityTest3() {
        String pr = PriorityChecker.checkPriority('PD');
        System.AssertEquals('Low', pr);
    }

    @IsTest
    static void checkPriorityTest4() {
        String pr = PriorityChecker.checkPriority('');
        System.AssertEquals(null, pr);
    }

}