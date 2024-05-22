# Documentation overview

I used:
- JSDOC
- Visual Studio Code
- ChatGPT
- GItHub and Git

jsdoc allow to standardize documentation through internal aspect of the codebase. During the week I documented the functionality of each function in the repository. JsDoc allowed me also to generate a website in order to have a place were to see al the available methods and variables, grouped by module. 

All the modified code is available on Github. I also used GItHub Actions in order to generate the JsDoc website and host it on github pages. The website will be updated to every changes.
To conclude, all the documentation its automatically implemented in VS Code, if you put the cursor over a documented function or variable is possible to see what that function will do, and how to use it (params + return).

# My inputs

Additionally these two vedios were really helpfull for documentation + live server:
- [JSDoc crash course](https://youtu.be/lTCadytiCNs?si=GaoVkxOJAbQ9ZeIF)
- [JSDoc](https://youtu.be/YK-GurROGIg?si=czRz66YIKOaFZ70N)
- [HTML](https://youtu.be/EquuZUHjcPU?si=K6Ny_cZyyx6z5WqU)
- [CSS](https://youtu.be/wvyYOFJAATk?si=tjSmNlUoem_ueNt7)
- [CSS](https://youtu.be/HNeBLKF_BRY?si=Pfpc5HGpfpc1Z0hG)
- [git](https://www.youtube.com/watch?v=8JJ101D3knE)
- [JavaScript_1](https://youtu.be/gRkQIN1GB5I?si=kEiAi8pv-1cC87Ry)
- [JavaScript_2](https://youtu.be/N4pNmwvXxUU?si=nFgUJQpHrRTrORov)
- [JavaScript_3](https://youtu.be/QPFRvclGTmw?si=0_o83a0LtMRJYZwH)
- [JavaScript Tutorial for Beginners](https://www.youtube.com/watch?v=W6NZfCO5SIk)



---
# llm: language models usage made easy

Manipulate any language model from the command line.

From [simple to advanced usage](#features).

```
$ llm "Hello world."
Hello there! How can I assist you today?
```

Leave a ⭐ star to support the project.

## Models

> Some models are still being added. This is a work in progress.

| Model Name                   | Status | Description                                     |
|------------------------------|--------|-------------------------------------------------|
| EVERY OpenAI model                | ✅      |                                         |
| gpt-3.5-turbo                | ✅      | ChatGPT                                         |
| gpt-4                    | ✅      | GPT-4 via API ([waitlist](https://openai.com/waitlist/gpt-4-api))                     |
| text-davinci-003             | ✅      | InstructGPT (GPT-3)                             |
| llama2                    | ✅      | Meta's Llama 2          |
| bing-chat                    | ✅      | Bing Chat: creative, balanced, precise          |
| bert                         | ✅      | BERT by Google                                  |
| llama-7b-hf                  | ✅      | Famous llama model                                |
| wizardlm-13b-uncensored      | ✅      | WizardLM 30B                                    |
| guanaco-65b-gptq             | ✅      | Guanaco 65B                                     |
| bard                         | 🔄      | Google Bard                                     |
| ... HuggingFace 🤗 models        | ✅      | every [text-generation](https://huggingface.co/models?pipeline_tag=text-generation&sort=downloads) model |

[Other models can be installed](#add-any-model) using the `--install` command.

## Features

| Feature                 | Status          |Comment          |
|-------------------------|-----------------|---|
| Prompt                  | ✅              |Prompt model with default parameters|
| Parameterization | ✅              |_temperature, max-length, top-p, top-k, ..._|
| ChatGPT Plugins                 | 🔄 | Use chatGPT plugins. web-pilot working, global plugin system in development|
| Use files    | ✅              |Query models using prompt files|
| Prompt chaining         | ✅              |Call prompts like functions|
| Prompt templating       | 🔄  |Use variables in prompt files |

## Getting started

```
git clone https://github.com/snwfdhmp/llm && cd llm
yarn install
```

make an alias `llm` 

```
alias llm="node $(pwd)/main.js"
```

> add it to your `.bashrc` or `.zshrc` to make it permanent.

**You're ready to go ! Try:**

```
$ llm "Hello world"
$ llm -m bing-creative "Tell me a joke"
$ llm -m gpt-3.5-turbo "Tell me a joke"
```

## Usage

> Simple prompting with defaults parameters

```
$ llm "what is the meaning of life?"
```

> Use a specific model

```
$ llm -m bing-creative "find project ideas to learn react"
```

> Use custom parameters

```
$ llm --max-length 512 --temperature 1 --top-p 0.9 --top-k 60 "follow the instructions."
```

> List available models

```
$ llm ls
Name                LastUsedAt     Author      Description
text-davinci-003    2021-10-10     OpenAI      InstructGPT by OpenAI
gpt-3.5-turbo       2021-10-10     OpenAI      ChatGPT by OpenAI
gpt-4-web           2021-10-10     OpenAI      GPT-4 by OpenAI via chatGPT
llama               2021-10-10     Meta        Meta's Llama
bard                2021-10-10     Google      Google Bard
...
```

> Use files as prompts

```
$ llm -f ./prompt.txt
```

Incoming:

- Conversation system (remember past messages)
- Install 3rd party models
- Chaining

```
$ llm -s session_name "what is the meaning of life?"
remembers past messages
$ llm --install github.com/snwfhdmp/llm-descriptor-llama
downloads model from github
```

## Add any model

Any model can be plugged into `llm` using a model descriptor.

**Example of a model descriptor which requires installation**

```yaml
kind: llm/descriptor/v1
metadata:
    name: llama
model:
    install: |
        git clone ...
        cd ...
        ./install.sh
        # or
        docker pull ...
        # or
        none
    usage:
        ./model-executor -f model.bin $LLM_PARAM_PROMPT
    parameters:
        LLM_PARAM_PROMPT:
            type: string
            description: The prompt to use
            default: "Hello world"
        LLM_PARAM_MAX_TOKENS:
            type: int
            description: The maximum length of context
            default: 100
        LLM_PARAM_TEMPERATURE:
            type: float
            description: The temperature of the model
            default: 0.7
```

**Example of a model descriptor which uses an API**

```yaml
kind: llm/descriptor/v1
metadata:
    name: llama
model:
    install: |
        read -p "Enter your API key:" LLM_API_KEY
        echo "LLM_API_KEY=$LLM_API_KEY" >> ~/.bashrc
    usage: curl -s $LLM_PARAM_API_TARGET_URL -d "prompt=$LLM_PARAM_PROMPT&api_key=$LLM_API_KEY"
    parameters:
        LLM_PARAM_API_TARGET_URL:
            type: string
            description: The URL of the API
            default: "https://api.llm.com"
        LLM_PARAM_PROMPT:
            type: string
            description: The prompt to use
            default: "Hello world"
        LLM_PARAM_MAX_TOKENS:
            type: int
            description: The maximum length of context
            default: 100
        LLM_PARAM_TEMPERATURE:
            type: float
            description: The temperature of the model
            default: 0.7
```

## Env variables

These variables can be used to tweak `llm` behavior.

- `LLM_DEFAULT_MODEL` - The default model to use when no model is specified
- `LLM_ENABLED_PLUGINS` - A comma-separated list of plugins to enable
- `OPENAI_ORGANIZATION_ID` - The organization ID to use for OpenAI models

## Roadmap

Project vision and information can be found in [docs](docs/).

## Contributing

Contribute easily by leaving a ⭐ star to the project.

Code contributions are welcome. Please open an issue or a pull request.

Join the team at [discord.gg/ccDghPeAT9](https://discord.gg/ccDghPeAT9).
