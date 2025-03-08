import { describe, expect, it } from 'vitest';
import { getPrimitiveProp, isDate, json2classes, json2csharp } from './json2csharp';

// Test isDate function
describe('isDate', () => {
  it('should return true for valid date strings', () => {
    expect(isDate('2024-03-08')).toBe(true);
    expect(isDate('2024-03-08T12:34:56Z')).toBe(true);
  });

  it('should return false for invalid date strings', () => {
    expect(isDate('hello')).toBe(false);
    expect(isDate('2024-13-08')).toBe(false); // Invalid month
    expect(isDate('9999-99-99')).toBe(false); // Invalid format
  });
});

// Test getPrimitiveProp function
describe('getPrimitiveProp', () => {
  it('should return \'string\' type for non-date strings', () => {
    expect(getPrimitiveProp('hello', 'testKey')).toEqual({
      type: 'string',
      name: 'testKey',
      canBeNullable: false,
    });
  });

  it('should return \'DateTime\' type for date strings', () => {
    expect(getPrimitiveProp('2024-03-08', 'dateKey')).toEqual({
      type: 'DateTime',
      name: 'dateKey',
      canBeNullable: true,
    });
  });

  it('should return \'int\' for integers', () => {
    expect(getPrimitiveProp(42, 'numberKey')).toEqual({
      type: 'int',
      name: 'numberKey',
      canBeNullable: true,
    });
  });

  it('should return \'double\' for floating point numbers', () => {
    expect(getPrimitiveProp(3.14, 'floatKey')).toEqual({
      type: 'double',
      name: 'floatKey',
      canBeNullable: true,
    });
  });

  it('should return \'bool\' for boolean values', () => {
    expect(getPrimitiveProp(true, 'boolKey')).toEqual({
      type: 'bool',
      name: 'boolKey',
      canBeNullable: true,
    });
  });

  it('should throw an error for unsupported types', () => {
    expect(() => getPrimitiveProp({}, 'objKey')).toThrow('Unexpected key \'objKey\' of type object');
  });
});

// Test json2classes function
describe('json2classes', () => {
  it('should convert JSON to class definitions with custom root', () => {
    const json = { name: 'John', age: 30 };
    const result = json2classes(json, 'Main');
    expect(result).to.deep.eq([
      {
        key: 'Main',
        props: [
          { type: 'string', name: 'name', canBeNullable: false },
          { type: 'int', name: 'age', canBeNullable: true },
        ],
      },
    ]);
  });

  it('should handle nested objects', () => {
    const json = { user: { name: 'John' } };
    const result = json2classes(json);
    expect(result).to.deep.eq([
      { key: 'Root', props: [{ type: 'User', name: 'user' }] },
      { key: 'User', props: [{ type: 'string', name: 'name', canBeNullable: false }] },
    ]);
  });

  it('should handle arrays of primitives', () => {
    const json = { numbers: [1, 2, 3] };
    const result = json2classes(json);
    expect(result).to.deep.eq([
      { key: 'Root', props: [{ type: 'int', name: 'numbers', isArray: true, canBeNullable: true }] },
    ]);
  });

  it('should handle arrays of objects', () => {
    const json = { users: [{ name: 'John' }, { name: 'Jane' }] };
    const result = json2classes(json);
    expect(result).to.deep.eq([
      { key: 'Root', props: [{ type: 'UsersItem', name: 'users', isArray: true }] },
      { key: 'UsersItem', props: [{ type: 'string', name: 'name', canBeNullable: false }] },
    ]);
  });
});

// Test json2csharp function
describe('json2csharp', () => {
  const cleanTabs = (s: string) => s.replace(/\t/g, '    ');

  it('should convert JSON to C# class with default options', () => {
    const json = JSON.stringify({ name: 'John', age: 30 });
    const result = cleanTabs(json2csharp({ src: json }));

    expect(result).toBe(`using System;
using System.Text.Json;

public class Root
{
    [JsonPropertyName(\"name\")]
    public string Name { get; set; }
    [JsonPropertyName(\"age\")]
    public int Age { get; set; }
}`);
  });

  it('should not change case if pascalCase option is false', () => {
    const json = JSON.stringify({ test: { user_name: 'John' } });
    const result = cleanTabs(json2csharp({ src: json, pascalCase: false }));

    expect(result).toBe(`using System;
using System.Text.Json;

public class Root
{
    [JsonPropertyName(\"test\")]
    public Test test { get; set; }
}

public class Test
{
    [JsonPropertyName(\"user_name\")]
    public string user_name { get; set; }
}`);
  });

  it('should handle when root is an array', () => {
    const json = JSON.stringify([{ age: 30 }]);
    const result = cleanTabs(json2csharp({ src: json, useNullable: true }));

    expect(result).toBe(`using System;
using System.Text.Json;

public class RootItem
{
    [JsonPropertyName(\"age\")]
    public int? Age { get; set; }
}`);
  });

  it('should use nullable types if useNullable option is true', () => {
    const json = JSON.stringify({ age: 30 });
    const result = cleanTabs(json2csharp({ src: json, useNullable: true }));

    expect(result).toBe(`using System;
using System.Text.Json;

public class Root
{
    [JsonPropertyName(\"age\")]
    public int? Age { get; set; }
}`);
  });

  it('should add JsonProperty attributes if addJsonProperty is true', () => {
    const json = JSON.stringify({ name: 'John' });
    const result = cleanTabs(json2csharp({ src: json, addJsonProperty: true }));

    expect(result).toBe(`using System;
using Newtonsoft.Json;
using System.Text.Json;

public class Root
{
    [JsonProperty(\"name\", NullValueHandling = NullValueHandling.Ignore)]
    [JsonPropertyName(\"name\")]
    public string Name { get; set; }
}`);
  });

  it('should add JsonPropertyName attributes if addJsonPropertyName is true', () => {
    const json = JSON.stringify({ name: 'John' });
    const result = cleanTabs(json2csharp({ src: json, addJsonPropertyName: true }));

    expect(result).toBe(`using System;
using System.Text.Json;

public class Root
{
    [JsonPropertyName(\"name\")]
    public string Name { get; set; }
}`);
  });

  it('should generate immutable classes if generateImmutableClasses is true', () => {
    const json = JSON.stringify({ name: 'John' });
    const result = cleanTabs(json2csharp({ src: json, generateImmutableClasses: true }));

    expect(result).toBe(`using System;
using System.Text.Json;

public class Root
{
    public Root(
        string name
    ){
        this.Name = name;
    }

    [JsonPropertyName(\"name\")]
    public string Name { get; }
}`);
  });

  it('should convert JSON with arrays into C# classes', () => {
    const json = {
      users: [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }],
    };

    expect(cleanTabs(json2csharp({ src: json }))).toBe(`using System;
using System.Text.Json;

public class Root
{
    [JsonPropertyName(\"users\")]
    public UsersItem[] Users { get; set; }
}

public class UsersItem
{
    [JsonPropertyName(\"name\")]
    public string Name { get; set; }
    [JsonPropertyName(\"age\")]
    public int Age { get; set; }
}`);
    expect(cleanTabs(json2csharp({ src: json, useRecordTypes: true }))).toBe(`using System;
using System.Text.Json;

public record Root(
    [property: JsonPropertyName(\"users\")]
    UsersItem[] Users
);

public record UsersItem(
    [property: JsonPropertyName(\"name\")]
    string Name,
    [property: JsonPropertyName(\"age\")]
    int Age
);`);
    expect(cleanTabs(json2csharp({ src: json, useRecordTypes: true, pascalCase: false, useReadonlyLists: true }))).toBe(`using System;
using System.Text.Json;

public record Root(
    [property: JsonPropertyName(\"users\")]
    IReadonlyList<UsersItem> users
);

public record UsersItem(
    [property: JsonPropertyName(\"name\")]
    string name,
    [property: JsonPropertyName(\"age\")]
    int age
);`);
  });

  it('should generate C# record types when useRecordTypes is true', () => {
    const json = JSON.stringify({ name: 'John', age: 30 });
    const result = cleanTabs(json2csharp({ src: json, useRecordTypes: true }));

    expect(result).toBe(`using System;
using System.Text.Json;

public record Root(
    [property: JsonPropertyName(\"name\")]
    string Name,
    [property: JsonPropertyName(\"age\")]
    int Age
);`);
  });

  it('should generate C# record types with attributes when useRecordTypes/addJsonProperty/addJsonPropertyName are true', () => {
    const json = JSON.stringify({ name: 'John', age: 30 });
    const result = cleanTabs(json2csharp({
      src: json,
      useRecordTypes: true,
      addJsonProperty: true,
      addJsonPropertyName: true,
    }));

    expect(result).toBe(`using System;
using Newtonsoft.Json;
using System.Text.Json;

public record Root(
    [property: JsonProperty(\"name\", NullValueHandling = NullValueHandling.Ignore)]
    [property: JsonPropertyName(\"name\")]
    string Name,
    [property: JsonProperty(\"age\", NullValueHandling = NullValueHandling.Ignore)]
    [property: JsonPropertyName(\"age\")]
    int Age
);`);
  });

  it('should handle arrays of primitives', () => {
    const json = JSON.stringify({ numbers: [1, 2, 3] });
    const result = cleanTabs(json2csharp({ src: json }));

    expect(result).toBe(`using System;
using System.Text.Json;

public class Root
{
    [JsonPropertyName(\"numbers\")]
    public int[] Numbers { get; set; }
}`);
  });

  it('should handle arrays of objects with PascalCase enabled', () => {
    const json = JSON.stringify({
      items: [{ item_name: 'A', price: 10.5 }],
    });
    const result = cleanTabs(json2csharp({
      src: json,
      pascalCase: true,
      addJsonProperty: true,
      addJsonPropertyName: true,
    }));

    expect(result).toBe(`using System;
using Newtonsoft.Json;
using System.Text.Json;

public class Root
{
    [JsonProperty(\"items\", NullValueHandling = NullValueHandling.Ignore)]
    [JsonPropertyName(\"items\")]
    public ItemsItem[] Items { get; set; }
}

public class ItemsItem
{
    [JsonProperty(\"item_name\", NullValueHandling = NullValueHandling.Ignore)]
    [JsonPropertyName(\"item_name\")]
    public string ItemName { get; set; }
    [JsonProperty(\"price\", NullValueHandling = NullValueHandling.Ignore)]
    [JsonPropertyName(\"price\")]
    public double Price { get; set; }
}`);
  });

  it('should use nullable types for optional fields when useNullable is true', () => {
    const json = JSON.stringify({ age: null, price: 10.5 });
    const result = cleanTabs(json2csharp({ src: json, useNullable: true }));

    expect(result).toBe(`using System;
using System.Text.Json;

public class Root
{
    [JsonPropertyName(\"age\")]
    public Age Age { get; set; }
    [JsonPropertyName(\"price\")]
    public double? Price { get; set; }
}

public class Age
{
}`);
  });

  it('should use fields when useFields is true', () => {
    const json = JSON.stringify({ age: 1, price: 10.5 });
    const result = cleanTabs(json2csharp({ src: json, useFields: true }));

    expect(result).toBe(`using System;
using System.Text.Json;

public class Root
{
    [JsonPropertyName(\"age\")]
    public int Age;
    [JsonPropertyName(\"price\")]
    public double Price;
}`);
  });

  it('should add JsonProperty attributes when addJsonProperty is true', () => {
    const json = JSON.stringify({ firstName: 'John', lastName: 'Doe' });
    const result = cleanTabs(json2csharp({ src: json, addJsonProperty: true, nullValueHandlingIgnore: false }));

    expect(result).toBe(`using System;
using Newtonsoft.Json;
using System.Text.Json;

public class Root
{
    [JsonProperty(\"firstName\")]
    [JsonPropertyName(\"firstName\")]
    public string FirstName { get; set; }
    [JsonProperty(\"lastName\")]
    [JsonPropertyName(\"lastName\")]
    public string LastName { get; set; }
}`);
  });

  it('should add JsonProperty attributes when addJsonProperty and nullValueHandlingIgnore are true', () => {
    const json = JSON.stringify({ firstName: 'John', lastName: 'Doe' });
    const result = cleanTabs(json2csharp({ src: json, addJsonProperty: true, nullValueHandlingIgnore: true }));

    expect(result).toBe(`using System;
using Newtonsoft.Json;
using System.Text.Json;

public class Root
{
    [JsonProperty(\"firstName\", NullValueHandling = NullValueHandling.Ignore)]
    [JsonPropertyName(\"firstName\")]
    public string FirstName { get; set; }
    [JsonProperty(\"lastName\", NullValueHandling = NullValueHandling.Ignore)]
    [JsonPropertyName(\"lastName\")]
    public string LastName { get; set; }
}`);
  });

  it('should handle all types', () => {
    const json = JSON.stringify({
      id: 1, date: '2025-06-09', amount: 1.4, group: null, active: true, email: 'test@example.com',
    });
    const result = cleanTabs(json2csharp({ src: json }));

    expect(result).toBe(`using System;
using System.Text.Json;

public class Root
{
    [JsonPropertyName(\"id\")]
    public int Id { get; set; }
    [JsonPropertyName(\"date\")]
    public DateTime Date { get; set; }
    [JsonPropertyName(\"amount\")]
    public double Amount { get; set; }
    [JsonPropertyName(\"group\")]
    public Group Group { get; set; }
    [JsonPropertyName(\"active\")]
    public bool Active { get; set; }
    [JsonPropertyName(\"email\")]
    public string Email { get; set; }
}

public class Group
{
}`);
  });

  it('should use readonly lists when useReadonlyLists is true', () => {
    const json = JSON.stringify({
      items: [{ name: 'Item1' }, { name: 'Item2' }],
    });
    const result = cleanTabs(json2csharp({ src: json, useReadonlyLists: true }));

    expect(result).toBe(`using System;
using System.Text.Json;

public class Root
{
    [JsonPropertyName(\"items\")]
    public List<ItemsItem> Items { get; } = new List<ItemsItem>;
}

public class ItemsItem
{
    [JsonPropertyName(\"name\")]
    public string Name { get; set; }
}`);
  });

  it('should use immutable class properties when generateImmutableClasses is true', () => {
    const json = JSON.stringify({ title: 'Book', pages: 300 });
    const result = cleanTabs(json2csharp({ src: json, generateImmutableClasses: true }));

    expect(result).toBe(`using System;
using System.Text.Json;

public class Root
{
    public Root(
        string title,
        int pages
    ){
        this.Title = title;
        this.Pages = pages;
    }

    [JsonPropertyName(\"title\")]
    public string Title { get; }
    [JsonPropertyName(\"pages\")]
    public int Pages { get; }
}`);
  });

  it('should generate a combination of options correctly', () => {
    const json = JSON.stringify({
      people: [
        { first_name: 'John', age: 30 },
        { first_name: 'Jane', age: 25 },
      ],
    });

    expect(cleanTabs(json2csharp({
      src: json,
      pascalCase: true,
      useNullable: true,
      addJsonProperty: true,
      generateImmutableClasses: true,
      useRecordTypes: false,
      useReadonlyLists: true,
    }))).toBe(`using System;
using Newtonsoft.Json;
using System.Text.Json;

public class Root
{
    public Root(
        List<PeopleItem> people
    ){
        this.People = people;
    }

    [JsonProperty(\"people\", NullValueHandling = NullValueHandling.Ignore)]
    [JsonPropertyName(\"people\")]
    public List<PeopleItem> People { get; } = new List<PeopleItem>;
}

public class PeopleItem
{
    public PeopleItem(
        string firstName,
        int? age
    ){
        this.FirstName = firstName;
        this.Age = age;
    }

    [JsonProperty(\"first_name\", NullValueHandling = NullValueHandling.Ignore)]
    [JsonPropertyName(\"first_name\")]
    public string FirstName { get; }
    [JsonProperty(\"age\", NullValueHandling = NullValueHandling.Ignore)]
    [JsonPropertyName(\"age\")]
    public int? Age { get; }
}`);
    expect(cleanTabs(json2csharp({
      src: json,
      pascalCase: true,
      useNullable: true,
      addJsonProperty: true,
      addJsonPropertyName: true,
      generateImmutableClasses: false,
      useRecordTypes: false,
      useReadonlyLists: true,
    }))).toBe(`using System;
using Newtonsoft.Json;
using System.Text.Json;

public class Root
{
    [JsonProperty(\"people\", NullValueHandling = NullValueHandling.Ignore)]
    [JsonPropertyName(\"people\")]
    public List<PeopleItem> People { get; } = new List<PeopleItem>;
}

public class PeopleItem
{
    [JsonProperty(\"first_name\", NullValueHandling = NullValueHandling.Ignore)]
    [JsonPropertyName(\"first_name\")]
    public string FirstName { get; set; }
    [JsonProperty(\"age\", NullValueHandling = NullValueHandling.Ignore)]
    [JsonPropertyName(\"age\")]
    public int? Age { get; set; }
}`);
    expect(cleanTabs(json2csharp({
      src: json,
      pascalCase: true,
      useNullable: true,
      addJsonProperty: true,
      useRecordTypes: true,
      useReadonlyLists: true,
    }))).toBe(`using System;
using Newtonsoft.Json;
using System.Text.Json;

public record Root(
    [property: JsonProperty(\"people\", NullValueHandling = NullValueHandling.Ignore)]
    [property: JsonPropertyName(\"people\")]
    IReadonlyList<PeopleItem> People
);

public record PeopleItem(
    [property: JsonProperty(\"first_name\", NullValueHandling = NullValueHandling.Ignore)]
    [property: JsonPropertyName(\"first_name\")]
    string FirstName,
    [property: JsonProperty(\"age\", NullValueHandling = NullValueHandling.Ignore)]
    [property: JsonPropertyName(\"age\")]
    int? Age
);`);
  });
});
