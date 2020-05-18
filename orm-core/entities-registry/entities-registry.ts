import { Mandarine } from "../../mod.ts";
import { Reflect } from "../../main-core/reflectMetadata.ts";
import { MandarineConstants } from "../../main-core/mandarineConstants.ts";

export class EntitiesRegistry implements Mandarine.ORM.Entity.EntitiesRegistry {

    private entities: Map<string, Mandarine.ORM.Entity.Table> = new Map<string, Mandarine.ORM.Entity.Table>();
    
    public register(schemaName: string, tableName: string, instance: any) {
        if(this.entities.get(`${schemaName}.${tableName}`) == (null || undefined)) {

            let columns = this.getColumnsFromEntity(instance);

            this.entities.set(`${schemaName}.${tableName}`, {
                tableName: tableName,
                schema: schemaName,
                columns: columns,
                uniqueConstraints: columns.filter((item) => item.unique == true),
                primaryKey: columns.find(item => item.options.primaryKey != undefined && item.options.primaryKey == true).name,
                instance: instance
            });

            
        }
    }

    public getColumnsFromEntity(entityInstance: any): Array<Mandarine.ORM.Entity.Decorators.Column> {
        let columns: Array<Mandarine.ORM.Entity.Decorators.Column> = new Array<Mandarine.ORM.Entity.Decorators.Column>();
        let initializedInstance: any = new entityInstance();

        let reflectEntityMetadataKeys = Reflect.getMetadataKeys(initializedInstance);

        if(reflectEntityMetadataKeys != undefined) {
            let reflectEntityColumnsMetadataKeys = reflectEntityMetadataKeys.filter((item: string) => item.startsWith(`${MandarineConstants.REFLECTION_MANDARINE_TABLE_COLUMN}:`));
            
            reflectEntityColumnsMetadataKeys.forEach((metadataKey: string) => {
                let columnData: Mandarine.ORM.Entity.Decorators.Column = Reflect.getMetadata(metadataKey, initializedInstance);
                if(columnData.options == undefined) columnData.options = {};

                var columnProperties = Reflect.getMetadataKeys(initializedInstance, columnData.fieldName);

                let primaryKeyMetadataKey = `${MandarineConstants.REFLECTION_MANDARINE_TABLE_COLUMN_PROPERTY}:${columnData.fieldName}:primaryKey`;
                let generatedValueMetadataKey = `${MandarineConstants.REFLECTION_MANDARINE_TABLE_COLUMN_PROPERTY}:${columnData.fieldName}:generatedValue`;

                if(columnProperties.some(item => item == primaryKeyMetadataKey)) {
                    columnData.nullable = false;
                    columnData.unique = true;
                    columnData.options.primaryKey = true;
                }

                if(columnProperties.some(item => item == generatedValueMetadataKey)) {
                    columnData.options.generatedValue = Reflect.getMetadata(generatedValueMetadataKey, initializedInstance, columnData.fieldName);
                    columnData.incrementStrategy = true;
                }

                columns.push(columnData);
            });
        }

        return columns;
    }

    public getAllEntities(): Array<Mandarine.ORM.Entity.Table> {
        return Array.from(this.entities.values());
    }


}