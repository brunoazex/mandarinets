import { Controller } from "../mvc-framework/core/decorators/stereotypes/controller/controller.ts";
import { GET } from "../mvc-framework/core/decorators/stereotypes/controller/routingDecorator.ts";
import { Session } from "../mvc-framework/core/decorators/stereotypes/controller/parameterDecorator.ts";
import { MandarineCore } from "../mod.ts";

@Controller()
class TestController {

    @GET('/session-counter')
    public helloWorld(@Session() session: any): string {
        if(session.times == undefined) session.times = 0;
        else session.times = session.times + 1;

        return `Times = ${session.times}`;
    }

}

new MandarineCore().MVC().run();