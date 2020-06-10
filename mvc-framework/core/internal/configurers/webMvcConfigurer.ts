import { getMandarineConfiguration } from "../../../../main-core/configuration/getMandarineConfiguration.ts";
import { Mandarine } from "../../../../main-core/Mandarine.ns.ts";
import { MandarineResourceResolver } from "../components/resource-handler-registry/mandarineResourceResolver.ts";
import { ResourceHandler } from "../components/resource-handler-registry/resourceHandler.ts";

export class WebMVCConfigurer implements Mandarine.MandarineMVC.Configurers.WebMVCConfigurer {

    constructor() {
        this.addResourceHandlers();
    }

    public addResourceHandlers(): Mandarine.MandarineCore.IResourceHandlerRegistry {
        let resourceHandlerRegistry = Mandarine.Global.getResourceHandlerRegistry();

        let mandarineConfiguration = getMandarineConfiguration();
        if(resourceHandlerRegistry.overriden == false && mandarineConfiguration.mandarine.resources.staticFolder != (null || undefined) && mandarineConfiguration.mandarine.resources.staticRegExpPattern != (null || undefined)) {
            resourceHandlerRegistry.addResourceHandler(
                new ResourceHandler()
                .addResourceHandler(new RegExp(mandarineConfiguration.mandarine.resources.staticRegExpPattern))
                .addResourceHandlerLocation(mandarineConfiguration.mandarine.resources.staticFolder)
                .addResourceHandlerIndex(mandarineConfiguration.mandarine.resources.staticIndex)
                .addResourceResolver(new MandarineResourceResolver())
            );
        }

        return resourceHandlerRegistry;
    }

}