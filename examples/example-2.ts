import { Value } from "../main-core/decorators/configuration-readers/value.ts";

export class ValueAnnotationTest {

    @Value('mandarine.server.port')
    public static hostPort: number;

    @Value('mandarine.server.host')
    public host: string;

    @Value('customKey')
    public static customKey: string;

}

console.log(ValueAnnotationTest.hostPort);
console.log(new ValueAnnotationTest().host);
console.log(ValueAnnotationTest.customKey);