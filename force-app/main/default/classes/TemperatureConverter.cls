public class TemperatureConverter{

    public static Decimal farhanheitToCelsius(Decimal farhenheit){
        Decimal celsius = (farhenheit - 32)*5/9;
        return celsius.setScale(2);
    }
}