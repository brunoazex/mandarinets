import { Mandarine } from "../../../main-core/Mandarine.ns.ts";
import { Reflect } from "../../../main-core/reflectMetadata.ts";
import { MandarineConstants } from "../../../main-core/mandarineConstants.ts";
import { Types } from "../../sql/types.ts";
import { ApplicationContext } from "../../../main-core/application-context/mandarineApplicationContext.ts";

export const Table = (decoratorOptions: Mandarine.ORM.Entity.Decorators.Table): Function => {
    return (target: any) => {
        ApplicationContext.getInstance().getEntitiesRegistry().register(decoratorOptions.schema, decoratorOptions.name, target);
    }
}

export const Column = (decoratorOptions?: Mandarine.ORM.Entity.Decorators.Column): Function => {
    return (target: any, propertyKey: string) => {

        var propertyType = Reflect.getMetadata("design:type", target, propertyKey);
        var propertyTypeName = propertyType.name;

        let currentTargetAnnotations: Array<any> = Reflect.getMetadataKeys(target);

        if(decoratorOptions == undefined) decoratorOptions = {};

        if(decoratorOptions.name == undefined) decoratorOptions.name = propertyKey;
        if(decoratorOptions.length == undefined) decoratorOptions.length = Mandarine.ORM.Defaults.ColumnDecoratorDefault.length;
        if(decoratorOptions.scale == undefined) decoratorOptions.scale = Mandarine.ORM.Defaults.ColumnDecoratorDefault.scale;
        if(decoratorOptions.precision == undefined) decoratorOptions.precision = Mandarine.ORM.Defaults.ColumnDecoratorDefault.precision;
        if(decoratorOptions.nullable == undefined) decoratorOptions.nullable = Mandarine.ORM.Defaults.ColumnDecoratorDefault.nullable;
        if(decoratorOptions.unique == undefined) decoratorOptions.unique = Mandarine.ORM.Defaults.ColumnDecoratorDefault.unique;

        decoratorOptions.fieldName = propertyKey;

        if(propertyTypeName === 'String' && decoratorOptions.type == (undefined || null)) {
            decoratorOptions.type = Types.VARCHAR;
        } else if(propertyTypeName === 'Boolean' && decoratorOptions.type == (undefined || null)) {
            decoratorOptions.type = Types.BOOLEAN;
        } else if(propertyTypeName == 'Number' && decoratorOptions.type == (undefined || null)) {
            decoratorOptions.type = Types.BIGINT;
        }

        let columnAnnotationMetadataKey: string = `${MandarineConstants.REFLECTION_MANDARINE_TABLE_COLUMN}:${decoratorOptions.name}`;

        if(!currentTargetAnnotations.some(metadataKeys => metadataKeys == columnAnnotationMetadataKey)) {
            Reflect.defineMetadata(columnAnnotationMetadataKey, decoratorOptions, target);
        }
    }
}

export const Id = () => {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(`${MandarineConstants.REFLECTION_MANDARINE_TABLE_COLUMN_PROPERTY}:${propertyKey}:primaryKey`, true, target, propertyKey);
    }
}

export const GeneratedValue = (decoratorOptions: Mandarine.ORM.Entity.Decorators.GeneratedValue) => {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(`${MandarineConstants.REFLECTION_MANDARINE_TABLE_COLUMN_PROPERTY}:${propertyKey}:generatedValue`, decoratorOptions, target, propertyKey);
    }
}
