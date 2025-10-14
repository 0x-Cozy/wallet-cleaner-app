#[test_only]
module shield::vault_tests {
    use sui::test_scenario::{Self};
    use shield::vault::{Self, ExampleNFT};

    const ADMIN: address = @0xAD;
    const USER: address = @0x1;

    #[test]
    fun test_create_vault() {
        let mut scenario = test_scenario::begin(ADMIN);
        let ctx = test_scenario::ctx(&mut scenario);

        let vault = vault::create_vault<ExampleNFT>(ctx);
        assert!(vault::get_hidden_nfts(&vault).length() == 0, 0);

        vault::clear_and_destroy_vault(vault);
        test_scenario::end(scenario);
    }

    #[test]
    fun test_hide_nft() {
        let mut scenario = test_scenario::begin(USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut vault = vault::create_vault<ExampleNFT>(ctx);
        let nft = vault::create_example_nft(ctx);

        vault::hide_nft(&mut vault, nft, ctx);
        assert!(vault::get_hidden_nfts(&vault).length() == 1, 0);

        let recovered_nft = vault::unhide_nft(&mut vault, 0, ctx);
        vault::destroy_example_nft(recovered_nft);
        vault::clear_and_destroy_vault(vault);
        test_scenario::end(scenario);
    }

    #[test]
    fun test_unhide_nft() {
        let mut scenario = test_scenario::begin(USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut vault = vault::create_vault<ExampleNFT>(ctx);
        let nft = vault::create_example_nft(ctx);

        vault::hide_nft(&mut vault, nft, ctx);
        assert!(vault::get_hidden_nfts(&vault).length() == 1, 0);

        let recovered_nft = vault::unhide_nft(&mut vault, 0, ctx);
        assert!(vault::get_hidden_nfts(&vault).length() == 0, 1);
        
        vault::destroy_example_nft(recovered_nft);
        vault::clear_and_destroy_vault(vault);

        test_scenario::end(scenario);
    }


    #[test]
    #[expected_failure(abort_code = 0)]
    fun test_hide_nft_wrong_owner() {
        let mut scenario = test_scenario::begin(USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut vault = vault::create_vault<ExampleNFT>(ctx);
        let nft = vault::create_example_nft(ctx);

        test_scenario::next_tx(&mut scenario, ADMIN);
        let ctx_admin = test_scenario::ctx(&mut scenario);

        vault::hide_nft(&mut vault, nft, ctx_admin);
        vault::clear_and_destroy_vault(vault);

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 1)]
    fun test_unhide_nft_wrong_owner() {
        let mut scenario = test_scenario::begin(USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut vault = vault::create_vault<ExampleNFT>(ctx);
        let nft = vault::create_example_nft(ctx);

        vault::hide_nft(&mut vault, nft, ctx);

        test_scenario::next_tx(&mut scenario, ADMIN);
        let ctx_admin = test_scenario::ctx(&mut scenario);

        let nft = vault::unhide_nft(&mut vault, 0, ctx_admin);
        vault::destroy_example_nft(nft);
        vault::clear_and_destroy_vault(vault);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_multiple_nfts() {
        let mut scenario = test_scenario::begin(USER);
        let ctx = test_scenario::ctx(&mut scenario);

        let mut vault = vault::create_vault<ExampleNFT>(ctx);

        let nft1 = vault::create_example_nft(ctx);
        let nft2 = vault::create_example_nft(ctx);
        let nft3 = vault::create_example_nft(ctx);

        vault::hide_nft(&mut vault, nft1, ctx);
        vault::hide_nft(&mut vault, nft2, ctx);
        vault::hide_nft(&mut vault, nft3, ctx);

        assert!(vault::get_hidden_nfts(&vault).length() == 3, 0);

        let recovered_nft = vault::unhide_nft(&mut vault, 1, ctx);
        assert!(vault::get_hidden_nfts(&vault).length() == 2, 1);
        
        vault::destroy_example_nft(recovered_nft);
        vault::clear_and_destroy_vault(vault);

        test_scenario::end(scenario);
    }
}
