@isTest
private class TemperatureConverterTest{

    @isTest
    static void fahrenheitToCelsiusTest(){
        Decimal celsius = TemperatureConverter.farhanheitToCelsius(32);
        System.assertEquals(0, celsius);
    }

    @isTest
    static void testWarmTemp(){
        Decimal celsius = TemperatureConverter.farhanheitToCelsius(70);
        System.Assert.areEqual(21.11, celsius);
    }

    @isTest
    static void testBoilingTemp(){
        Decimal celsius = TemperatureConverter.farhanheitToCelsius(212);
        System.Assert.areEqual(100, celsius);
    }

    @isTest
    static void testNegativeTemp(){
        Decimal celsius = TemperatureConverter.farhanheitToCelsius(-10);
        System.Assert.areEqual(-23.33, celsius);
    
    }
}