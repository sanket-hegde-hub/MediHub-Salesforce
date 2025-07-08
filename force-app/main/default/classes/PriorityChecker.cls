public class PriorityChecker {

    public static String checkPriority(String leadState){
        if(String.isBlank(leadState))
            return null;

        String priority = '';
        if(leadState.equals('NY')){
            priority = 'High';
        }else{
            priority = 'Low';
        }

        return priority;
    }
}